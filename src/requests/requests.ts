import axios from "axios";
import { IAccauntsInMeeting, IAllResultsMeeting, IListCompany, IMail, IMeeting, IMeetingCreate, IMeetingUsers, IPutDrafts, IResultsMeeting, IUsersInMeeting, VoteDtls } from "./interfaces";
import { IMeetingUpdate } from "../pages/admin/newMessage/newMessage";

const API_URL = "http://localhost:8000/";

const token = JSON.parse(localStorage.getItem('user')!);

export const getMeetings = async (): Promise<IMail[]> => {
    const response = await axios.get(API_URL + "api/meetings/", {
        headers: {
            Authorization: "Bearer " + token
        },
    }
    )
    return response.data;
}

export const getDrafts = async (): Promise<IMail[]> => {
    const response = await axios.get(API_URL + "api/meetings/drafts/", {
        headers: {
            Authorization: "Bearer " + token
        },
    }
    )
    return response.data;
}

export const getMeetingForId = async (id: number): Promise<IMeeting> => {
    const response = await axios.get(API_URL + `api/meetings/${id}/`, {
        headers: {
            Authorization: "Bearer " + token
        },
    })
    return response.data
}

export const getMeetingForIdUser = async (id: number, userId: number): Promise<IMeetingUsers> => {
    const response = await axios.get(API_URL + `${id}/vote/${userId}/`, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    return response.data
}

export const getUsersinMeetingAdmin = async (id: number): Promise<IUsersInMeeting[]> => {
    const response = await axios.get(API_URL + `${id}/registered_users/`, {
        headers: {
            Authorization: "Bearer " + token
        },
    })
    return response.data
}

export const postMeetingCreate = async (data: IMeetingCreate) => {
    try {
        const response = await axios.post(API_URL + "api/meetings/create/", data, {
            headers: {
                Authorization: "Bearer " + token
            },
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка при создании собрания:", error);
        throw error; 
    }
};

export const getListCompany = async (): Promise<IListCompany[]> => {
    const response = await axios.get(API_URL + "/api/meetings/create/", {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    return response.data as IListCompany[];
}

export const getMeetingResults = async (meeting_id: number, account_id: number) => {
    try {
        const response = await axios.get(API_URL + `${meeting_id}/vote_results/${account_id}/`, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
        return response.data as IResultsMeeting;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getMeetingAllResult = async (meeting_id: number) => {
    try {
        const response = await axios.get(API_URL + `${meeting_id}/all_vote_results/`, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
        return response.data as IAllResultsMeeting;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getDraftForId = async (meeting_id: number): Promise<IMeetingUpdate> => {
    const response = await axios.get(API_URL + `/api/meetings/${meeting_id}/draft/`, {
        headers: {
            Authorization: "Bearer " + token,
        }
    })
    return response.data
}

export const putDraft = async (meeting_id: number, data: IPutDrafts) => {
    await axios.put(
        `${API_URL}/api/meetings/${meeting_id}/draft/`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
}

export const putMeeting = async (meeting_id: number) => {
    try {
        const response = await axios.put(
            `${API_URL}/api/meetings/${meeting_id}/send/`, 
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        console.error("Error during meeting update:", error);
        throw error; 
    }
};

export const postRegister = async (meeting_id: number): Promise<{ message: string }> => {
    const response = await axios.post(
        `${API_URL}/${meeting_id}/register/`,
        {},
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    );
    return response.data;
};


export const getAccounts = async (meeting_id: number): Promise<IAccauntsInMeeting> => {
    const responce = await axios.get(API_URL + `/api/meetings/${meeting_id}/accounts/`, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    return responce.data
}

export const postVote = async (meeting_id: number, data: VoteDtls, account_id: number) => {
    try {
        const response = await axios.post(
            `${API_URL}/${meeting_id}/vote/${account_id}/`,
            { VoteDtls: data },
            { headers: { Authorization: "Bearer " + token } }
        );
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}