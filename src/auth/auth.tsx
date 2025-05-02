import axios from "axios";

const API_URL = "http://localhost:8000/api/token/";

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
    try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            throw new Error("Refresh token не найден");
        }

        const response = await axios.post(API_URL + "refresh", {
            refresh: JSON.parse(refreshToken)
        });

        if (response.data.access_token) {
            localStorage.setItem("user", JSON.stringify(response.data.access_token));
            localStorage.setItem("refresh", JSON.stringify(response.data.refresh_token));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
        logout(); // Выход при ошибке обновления токена
        return false;
    }
};

export const logout = () => {
    localStorage.clear();
};


export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user")!);
}

const scheduleTokenRefresh = () => {
    const REFRESH_INTERVAL = 55 * 60 * 1000;

    setInterval(async () => {
        try {
            const success = await refreshToken();
            if (!success) {
                console.error("Не удалось обновить токен");
            }
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
        }
    }, REFRESH_INTERVAL);
};

scheduleTokenRefresh();