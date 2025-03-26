import axios from "axios";

const API_URL = "http://localhost:8000/api/token/";

const user = JSON.parse(localStorage.getItem("user")!);
const refresh = JSON.parse(localStorage.getItem("refresh")!)

export const login = (username: string, password: string) => {
    return axios
        .post(API_URL, {
            username,
            password
        })
        .then((response) => {
            if (response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data.access_token));
                localStorage.setItem("refresh", JSON.stringify(response.data.refresh_token))
            }
        });
};



export const refreshToken = () => {
    axios
        .post(API_URL + "/refresh", {
            refresh: refresh
        },
            // {
            //     headers: {
            //         Authorization: `Bearer ${user}`,
            //     },
            // }
        )
        .then((response) => {
            if (response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data.access_token));
                localStorage.setItem("refresh", JSON.stringify(response.data.refresh_token))
            }
        });
};

export const logout = () => {
    localStorage.clear();
};


export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user")!);
}

const scheduleTokenRefresh = () => {
    const REFRESH_INTERVAL = 29 * 60 * 1000;

    setInterval(async () => {
        try {
            await refreshToken();
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
        }
    }, REFRESH_INTERVAL);
};

scheduleTokenRefresh();