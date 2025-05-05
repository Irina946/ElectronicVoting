import axios from "axios";

const API_URL = "http://localhost:8000/api/token/";

// Флаг для отслеживания выполнения refreshToken
let isRefreshing = false;
// Идентификатор интервала обновления токена
let tokenRefreshInterval: number | null = null;

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    _tokenRefreshInterval?: number;
  }
}

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(API_URL, { username, password });

        const { access, refresh, is_staff } = response.data || {};
        if (access && refresh !== undefined && is_staff !== undefined) {
            localStorage.setItem("user", JSON.stringify(access));
            localStorage.setItem("refresh", JSON.stringify(refresh));
            localStorage.setItem("accountType", JSON.stringify(!!is_staff));
        }

        return { success: true, isStaff: !!is_staff };
    } catch (error) {
        console.error("Ошибка при входе:", error);
        return { success: false, error };
    }
};

export const refreshToken = async () => {
    // Если запрос уже выполняется, не запускаем новый
    if (isRefreshing) {
        return false;
    }

    isRefreshing = true;

    try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            throw new Error("Refresh token не найден");
        }

        // Проверка срока действия токена
        const token = localStorage.getItem("user");
        if (!token) {
            throw new Error("Access token не найден");
        }

        // Пытаемся обновить токен, если API недоступен, просто продолжаем использовать текущий
        try {
            const response = await axios.post(API_URL + "refresh/", {
                refresh: JSON.parse(refreshToken)
            });

            // Проверяем наличие токенов в ответе. Имена полей могут отличаться в зависимости от API
            if (response.data.access) {
                localStorage.setItem("user", JSON.stringify(response.data.access));
                localStorage.setItem("refresh", JSON.stringify(response.data.refresh));
                return true;
            } else if (response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data.access_token));
                localStorage.setItem("refresh", JSON.stringify(response.data.refresh_token));
                return true;
            }
        } catch (error) {
            console.error("Ошибка при обновлении токена:", error);
            // Если сервер недоступен или вернул ошибку, но у нас всё ещё есть токен,
            // не выходим, а просто возвращаем false
            if (axios.isAxiosError(error) && error.response?.status === 500) {
                console.warn("Сервер временно недоступен. Используем текущий токен.");
                return false;
            }
        }

        // Если не смогли обновить токен и нет указания сохранить сессию, выходим
        logout();
        return false;
    } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        logout(); // Выход при ошибке проверки токена
        return false;
    } finally {
        isRefreshing = false;
    }
};

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("refresh");
    localStorage.removeItem("accountType");
};

export const getCurrentUser = () => {
    const token = localStorage.getItem("user");
    return token ? JSON.parse(token) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("user");
};

export const isAdmin = () => {
    const accountType = localStorage.getItem("accountType");
    return accountType ? JSON.parse(accountType) : false;
};

// Планировщик обновления токена
const scheduleTokenRefresh = () => {
    const REFRESH_INTERVAL = 55 * 60 * 1000; // 55 минут

    // Очищаем предыдущие интервалы, если они были
    if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
    }

    // Устанавливаем интервал обновления токена
    tokenRefreshInterval = window.setInterval(() => {
        // Обновляем токен, только если пользователь аутентифицирован
        if (isAuthenticated()) {
            refreshToken().catch(error => {
                console.error("Ошибка при плановом обновлении токена:", error);
            });
        }
    }, REFRESH_INTERVAL);
};

// Запускаем планировщик при загрузке модуля
scheduleTokenRefresh();