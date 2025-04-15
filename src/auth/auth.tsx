import axios from "axios";

const API_URL = "http://localhost:8000/api/token/";

let accessToken: string | null = null;

// --- Авторизация ---
export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(API_URL, { username, password });
        const { access, refresh, is_staff } = response.data || {};

        if (access && refresh && typeof is_staff !== "undefined") {
            // Храним только refresh в localStorage, access — в памяти
            accessToken = access;
            localStorage.setItem("refresh", JSON.stringify(refresh));
            localStorage.setItem("accountType", JSON.stringify(!!is_staff));
        }

        return { success: true, isStaff: !!is_staff };
    } catch (error) {
        console.error("Ошибка при входе:", error);
        return { success: false, error };
    }
};

// --- Обновление access-токена ---
export const refreshToken = async () => {
    try {
        const storedRefresh = localStorage.getItem("refresh");
        if (!storedRefresh) throw new Error("Нет refresh токена");

        const response = await axios.post(`${API_URL}refresh/`, {
            refresh: JSON.parse(storedRefresh)
        });

        if (response.data.access) {
            accessToken = response.data.access;
        }

    } catch (error) {
        console.error("Ошибка обновления токена:", error);
        logout(); // при ошибке — выходим
    }
};

// --- Получение access-токена (из памяти) ---
export const getAccessToken = () => accessToken;

// --- Выход ---
export const logout = () => {
    accessToken = null;
    localStorage.clear();
};


const scheduleTokenRefresh = () => {
    const REFRESH_INTERVAL = 50 * 60 * 1000;

    setInterval(async () => {
        await refreshToken();
    }, REFRESH_INTERVAL);
};

scheduleTokenRefresh();

axios.interceptors.request.use(
    async (config) => {
        if (!accessToken) {
            await refreshToken();
        }
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
