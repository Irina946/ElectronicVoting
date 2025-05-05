import { useRequestCache } from '../hooks/useRequestCache';
import { 
  getMeetings, 
  getDrafts, 
  getMeetingForId, 
  getListCompany, 
  getMeetingResults, 
  getMeetingAllResult, 
  getAccounts, 
  getUsersinMeetingAdmin
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

/**
 * Хук для работы с кэшированными запросами
 */
export const useCachedRequests = () => {
  const { cachedRequest, clearCache, updateCache } = useRequestCache();

  // Получение всех встреч с кэшированием (TTL: 2 минуты)
  const getCachedMeetings = async () => {
    return cachedRequest<IMail[]>(
      'meetings',
      getMeetings,
      { ttl: 2 * 60 * 1000 }
    );
  };

  // Получение черновиков с кэшированием (TTL: 1 минута)
  const getCachedDrafts = async () => {
    return cachedRequest<IMail[]>(
      'drafts',
      getDrafts,
      { ttl: 60 * 1000 }
    );
  };

  // Получение встречи по ID с кэшированием (TTL: 5 минут)
  const getCachedMeetingForId = async (id: number) => {
    return cachedRequest<IMeeting>(
      `meeting_${id}`,
      () => getMeetingForId(id),
      { ttl: 5 * 60 * 1000 }
    );
  };

  // Получение списка компаний с кэшированием (TTL: 10 минут)
  const getCachedListCompany = async () => {
    return cachedRequest<IListCompany[]>(
      'companies',
      getListCompany,
      { ttl: 10 * 60 * 1000 }
    );
  };

  // Получение результатов встречи с кэшированием (TTL: 1 минута)
  const getCachedMeetingResults = async (meeting_id: number, account_id: number) => {
    return cachedRequest<IResultsMeeting>(
      `meeting_results_${meeting_id}_${account_id}`,
      () => getMeetingResults(meeting_id, account_id),
      { ttl: 60 * 1000 }
    );
  };

  // Получение всех результатов встречи с кэшированием (TTL: 1 минута)
  const getCachedMeetingAllResult = async (meeting_id: number) => {
    return cachedRequest<IAllResultsMeeting>(
      `meeting_all_results_${meeting_id}`,
      () => getMeetingAllResult(meeting_id),
      { ttl: 60 * 1000 }
    );
  };

  // Получение аккаунтов встречи с кэшированием (TTL: 5 минут)
  const getCachedAccounts = async (meeting_id: number) => {
    return cachedRequest<IAccauntsInMeeting>(
      `accounts_${meeting_id}`,
      () => getAccounts(meeting_id),
      { ttl: 5 * 60 * 1000 }
    );
  };

  // Получение пользователей встречи с кэшированием (TTL: 2 минуты)
  const getCachedUsersInMeetingAdmin = async (id: number) => {
    return cachedRequest<IUsersInMeeting[]>(
      `users_in_meeting_${id}`,
      () => getUsersinMeetingAdmin(id),
      { ttl: 2 * 60 * 1000 }
    );
  };

  // Функция для инвалидации кэша после создания/обновления встречи
  const invalidateMeetingCache = (meetingId?: number) => {
    clearCache('meetings');
    clearCache('drafts');
    
    if (meetingId) {
      clearCache(`meeting_${meetingId}`);
      clearCache(`meeting_results_${meetingId}`);
      clearCache(`meeting_all_results_${meetingId}`);
      clearCache(`accounts_${meetingId}`);
      clearCache(`users_in_meeting_${meetingId}`);
    }
  };

  return {
    getCachedMeetings,
    getCachedDrafts,
    getCachedMeetingForId,
    getCachedListCompany,
    getCachedMeetingResults,
    getCachedMeetingAllResult,
    getCachedAccounts,
    getCachedUsersInMeetingAdmin,
    invalidateMeetingCache,
    clearCache,
    updateCache
  };
}; 