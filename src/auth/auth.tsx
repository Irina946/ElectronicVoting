import axios from "axios";

const API_URL = "http://localhost:8000/api/token/";

// Флаг для отслеживания выполнения refreshToken
let isRefreshing = false;
// Идентификатор интервала обновления токена
let tokenRefreshInterval: number | null = null;
// Список ожидающих запросов во время обновления токена
let failedRequestsQueue: Array<{
    onSuccess: (token: string) => void;
    onFailure: (error: unknown) => void;
}> = [];

// Расширяем глобальный интерфейс Window
declare global {
    interface Window {
        _tokenRefreshInterval?: number;
    }
}

// Проверка истечения срока действия токена
export const isTokenExpired = (token: string): boolean => {
    try {
        // Проверяем наличие токена
        if (!token) return true;

        // Декодируем JWT токен
        const base64Url = token.split('.')[1];
        if (!base64Url) return true;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        // Проверяем наличие поля exp
        if (!payload.exp) return true;

        // Проверяем срок действия токена
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (e) {
        console.error('Ошибка при проверке срока действия токена:', e);
        return true;
    }
};

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(API_URL, { username, password });

        const { access, refresh, is_staff } = response.data || {};
        if (access && refresh !== undefined && is_staff !== undefined) {
            localStorage.setItem("user", JSON.stringify(access));
            localStorage.setItem("refresh", JSON.stringify(refresh));
            localStorage.setItem("accountType", JSON.stringify(is_staff ? 'admin' : 'user'));

            // Запускаем процесс автоматического обновления токенов
            scheduleTokenRefresh();
        }

        return { success: true, isStaff: !!is_staff };
    } catch (error) {
        console.error("Ошибка при входе:", error);
        return { success: false, error };
    }
};

export const refreshToken = async () => {
    // Если запрос уже выполняется, ставим новые запросы в очередь
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
                onSuccess: () => resolve(true),
                onFailure: (error) => reject(error)
            });
        });
    }

    isRefreshing = true;

    try {
        const refreshTokenStr = localStorage.getItem("refresh");
        if (!refreshTokenStr) {
            throw new Error("Refresh token не найден");
        }

        // Проверяем, есть ли текущий токен
        const tokenStr = localStorage.getItem("user");
        if (!tokenStr) {
            throw new Error("Access token не найден");
        }

        const parsedToken = JSON.parse(tokenStr);

        // Если токен не истек и это не принудительное обновление, просто возвращаем true
        if (!isTokenExpired(parsedToken)) {
            return true;
        }

        try {
            const response = await axios.post(API_URL + "refresh/", {
                refresh: JSON.parse(refreshTokenStr)
            });

            // Проверяем наличие токенов в ответе
            if (response.data.access) {
                localStorage.setItem("user", JSON.stringify(response.data.access));

                // Обновляем refresh токен, если он есть в ответе
                if (response.data.refresh) {
                    localStorage.setItem("refresh", JSON.stringify(response.data.refresh));
                }

                // Обрабатываем очередь запросов, которые ждали обновления токена
                failedRequestsQueue.forEach(request => request.onSuccess(response.data.access));
                failedRequestsQueue = [];

                return true;
            } else if (response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data.access_token));

                // Обновляем refresh токен, если он есть в ответе
                if (response.data.refresh_token) {
                    localStorage.setItem("refresh", JSON.stringify(response.data.refresh_token));
                }

                // Обрабатываем очередь запросов, которые ждали обновления токена
                failedRequestsQueue.forEach(request => request.onSuccess(response.data.access_token));
                failedRequestsQueue = [];

                return true;
            }
        } catch (error) {
            console.error("Ошибка при обновлении токена:", error);

            // Обрабатываем очередь запросов с ошибкой
            failedRequestsQueue.forEach(request => request.onFailure(error));
            failedRequestsQueue = [];

            // Если сервер недоступен, не выходим, а просто возвращаем false
            if (axios.isAxiosError(error) && (error.response?.status === 500 || !error.response)) {
                console.warn("Сервер временно недоступен. Используем текущий токен.");
                return false;
            }

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Если refresh token недействителен, просто возвращаем false
                return false;
            }
        }

        return false;
    } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        
        // Обрабатываем очередь запросов с ошибкой
        failedRequestsQueue.forEach(request => request.onFailure(error));
        failedRequestsQueue = [];

        return false;
    } finally {
        isRefreshing = false;
    }
};

export const getCurrentUser = () => {
    const token = localStorage.getItem("user");
    return token ? JSON.parse(token) : null;
};

export const getCurrentUsername = (): string | null => {
    // Возвращаем null, так как мы больше не декодируем JWT
    return null;
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("user");
    if (!token) return false;

    try {
        // Проверяем наличие токена
        const parsedToken = JSON.parse(token);
        if (isTokenExpired(parsedToken)) {
            // Если токен истек, пытаемся обновить его
            refreshToken().catch(error => {
                console.error("Ошибка при автоматическом обновлении токена:", error);
            });
            // Возвращаем true, так как процесс обновления токена запущен
            return true;
        }
        return true;
    } catch (e) {
        console.error('Ошибка при проверке аутентификации:', e);
        return false;
    }
};

export const isAdmin = () => {
    const accountType = localStorage.getItem("accountType");
    return accountType ? JSON.parse(accountType) : false;
};

// Планировщик обновления токена
const scheduleTokenRefresh = () => {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 минут

    // Очищаем предыдущие интервалы
    if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
    }

    // Устанавливаем интервал обновления токена
    tokenRefreshInterval = window.setInterval(() => {
        // Обновляем токен, только если пользователь аутентифицирован
        if (isAuthenticated()) {
            const token = getCurrentUser();
            if (token && isTokenExpired(token)) {
                refreshToken().catch(error => {
                    console.error("Ошибка при плановом обновлении токена:", error);
                });
            }
        } else {
            // Если пользователь не аутентифицирован, останавливаем интервал
            if (tokenRefreshInterval) {
                clearInterval(tokenRefreshInterval);
                tokenRefreshInterval = null;
            }
        }
    }, REFRESH_INTERVAL);
};

// Настраиваем axios для автоматического добавления токена и обработки ошибок 401
export const setupAxiosInterceptors = () => {
    // Добавляем интерцептор запросов
    axios.interceptors.request.use(
        async (config) => {
            // Проверяем, нужно ли добавлять токен (не добавляем для запросов аутентификации)
            if (!config.url?.includes(API_URL)) {
                const token = getCurrentUser();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Добавляем интерцептор ответов
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            // Обрабатываем 401 ошибку
            if (axios.isAxiosError(error) && error.response?.status === 401 && error.config) {
                try {
                    // Пытаемся обновить токен
                    const refreshed = await refreshToken();
                    if (refreshed && error.config) {
                        // Если токен обновлен успешно, повторяем исходный запрос
                        const token = getCurrentUser();
                        if (token) {
                            error.config.headers = error.config.headers || {};
                            error.config.headers.Authorization = `Bearer ${token}`;
                        }
                        return axios(error.config);
                    }
                } catch (refreshError) {
                    console.error('Не удалось обновить токен:', refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};

// Запускаем планировщик и настраиваем axios при загрузке модуля
if (isAuthenticated()) {
    scheduleTokenRefresh();
}
setupAxiosInterceptors();