import { useOptimizedRequest } from '../hooks/useOptimizedRequest';
import {
    getMeetings,
    getDrafts,
    getMeetingForId,
    getListCompany,
    getMeetingResults,
    getMeetingAllResult,
    getAccounts,
    getUsersinMeetingAdmin,
    getDraftForId
} from './requests';
import {
    IAccauntsInMeeting,
    IAllResultsMeeting,
    IListCompany,
    IMail,
    IMeeting,
    IResultsMeeting,
    IUsersInMeeting
} from './interfaces';
import { IMeetingUpdate } from '../utils/interfaces';

/**
 * Хук для работы с оптимизированными запросами
 * Включает кэширование и мониторинг производительности
 */
export const useOptimizedRequests = () => {
    const {
        optimizedRequest,
        clearOptimizedCache,
        isLoading,
        getError
    } = useOptimizedRequest();

    // Получение всех встреч (TTL: 2 минуты)
    const getOptimizedMeetings = async (forceRefresh = false) => {
        return optimizedRequest<IMail[]>(
            'meetings',
            getMeetings,
            {
                ttl: 2 * 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение черновиков (TTL: 1 минута)
    const getOptimizedDrafts = async (forceRefresh = false) => {
        return optimizedRequest<IMail[]>(
            'drafts',
            getDrafts,
            {
                ttl: 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение встречи по ID (TTL: 5 минут)
    const getOptimizedMeetingForId = async (id: number, forceRefresh = false) => {
        return optimizedRequest<IMeeting>(
            `meeting_${id}`,
            () => getMeetingForId(id),
            {
                ttl: 5 * 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение черновика по ID (TTL: 1 минута)
    const getOptimizedDraftForId = async (id: number, forceRefresh = false) => {
        return optimizedRequest<IMeetingUpdate>(
            `draft_${id}`,
            () => getDraftForId(id),
            {
                ttl: 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение списка компаний (TTL: 10 минут)
    const getOptimizedListCompany = async (forceRefresh = false) => {
        return optimizedRequest<IListCompany[]>(
            'companies',
            getListCompany,
            {
                ttl: 10 * 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение результатов встречи (TTL: 1 минута)
    const getOptimizedMeetingResults = async (meeting_id: number, account_id: number, forceRefresh = false) => {
        return optimizedRequest<IResultsMeeting>(
            `meeting_results_${meeting_id}_${account_id}`,
            () => getMeetingResults(meeting_id, account_id),
            {
                ttl: 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение всех результатов встречи (TTL: 1 минута)
    const getOptimizedMeetingAllResult = async (meeting_id: number, forceRefresh = false) => {
        return optimizedRequest<IAllResultsMeeting>(
            `meeting_all_results_${meeting_id}`,
            () => getMeetingAllResult(meeting_id),
            {
                ttl: 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение аккаунтов встречи (TTL: 5 минут)
    const getOptimizedAccounts = async (meeting_id: number, forceRefresh = false) => {
        return optimizedRequest<IAccauntsInMeeting>(
            `accounts_${meeting_id}`,
            () => getAccounts(meeting_id),
            {
                ttl: 5 * 60 * 1000,
                forceRefresh
            }
        );
    };

    // Получение пользователей встречи (TTL: 2 минуты)
    const getOptimizedUsersInMeetingAdmin = async (id: number, forceRefresh = false) => {
        return optimizedRequest<IUsersInMeeting[]>(
            `users_in_meeting_${id}`,
            () => getUsersinMeetingAdmin(id),
            {
                ttl: 2 * 60 * 1000,
                forceRefresh
            }
        );
    };

    // Функция для инвалидации кэша после создания/обновления встречи
    const invalidateMeetingCache = (meetingId?: number) => {
        clearOptimizedCache('meetings');
        clearOptimizedCache('drafts');

        if (meetingId) {
            clearOptimizedCache(`meeting_${meetingId}`);
            clearOptimizedCache(`draft_${meetingId}`);
            clearOptimizedCache(`meeting_results_${meetingId}`);
            clearOptimizedCache(`meeting_all_results_${meetingId}`);
            clearOptimizedCache(`accounts_${meetingId}`);
            clearOptimizedCache(`users_in_meeting_${meetingId}`);
        }
    };

    // Проверка состояния загрузки
    const isMeetingsLoading = () => isLoading('meetings');
    const isDraftsLoading = () => isLoading('drafts');
    const isMeetingLoading = (id: number) => isLoading(`meeting_${id}`);
    const isDraftLoading = (id: number) => isLoading(`draft_${id}`);
    const isCompaniesLoading = () => isLoading('companies');
    const isMeetingResultsLoading = (meeting_id: number, account_id: number) =>
        isLoading(`meeting_results_${meeting_id}_${account_id}`);
    const isMeetingAllResultsLoading = (meeting_id: number) =>
        isLoading(`meeting_all_results_${meeting_id}`);
    const isAccountsLoading = (meeting_id: number) => isLoading(`accounts_${meeting_id}`);
    const isUsersInMeetingLoading = (id: number) => isLoading(`users_in_meeting_${id}`);

    // Получение ошибок запросов
    const getMeetingsError = () => getError('meetings');
    const getDraftsError = () => getError('drafts');
    const getMeetingError = (id: number) => getError(`meeting_${id}`);
    const getDraftError = (id: number) => getError(`draft_${id}`);
    const getCompaniesError = () => getError('companies');
    const getMeetingResultsError = (meeting_id: number, account_id: number) =>
        getError(`meeting_results_${meeting_id}_${account_id}`);
    const getMeetingAllResultsError = (meeting_id: number) =>
        getError(`meeting_all_results_${meeting_id}`);
    const getAccountsError = (meeting_id: number) => getError(`accounts_${meeting_id}`);
    const getUsersInMeetingError = (id: number) => getError(`users_in_meeting_${id}`);

    return {
        // Оптимизированные запросы
        getOptimizedMeetings,
        getOptimizedDrafts,
        getOptimizedMeetingForId,
        getOptimizedDraftForId,
        getOptimizedListCompany,
        getOptimizedMeetingResults,
        getOptimizedMeetingAllResult,
        getOptimizedAccounts,
        getOptimizedUsersInMeetingAdmin,

        // Управление кэшем
        invalidateMeetingCache,
        clearCache: clearOptimizedCache,

        // Состояния загрузки
        isMeetingsLoading,
        isDraftsLoading,
        isMeetingLoading,
        isDraftLoading,
        isCompaniesLoading,
        isMeetingResultsLoading,
        isMeetingAllResultsLoading,
        isAccountsLoading,
        isUsersInMeetingLoading,

        // Ошибки
        getMeetingsError,
        getDraftsError,
        getMeetingError,
        getDraftError,
        getCompaniesError,
        getMeetingResultsError,
        getMeetingAllResultsError,
        getAccountsError,
        getUsersInMeetingError
    };
}; 