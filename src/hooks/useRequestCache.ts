import { useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // время жизни кэша в миллисекундах (по умолчанию 5 минут)
}

/**
 * Хук для кэширования результатов API запросов
 */
export function useRequestCache() {
  // Используем useRef для хранения кэша, чтобы он сохранялся между рендерами
  const cache = useRef<Record<string, CacheItem<unknown>>>({});
  
  /**
   * Получает данные из кэша или выполняет запрос и кэширует результат
   * @param key - ключ для кэширования
   * @param fetchFn - функция запроса, которая должна возвращать Promise
   * @param options - опции кэширования
   */
  const cachedRequest = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> => {
    const { ttl = 5 * 60 * 1000 } = options; // По умолчанию 5 минут
    const now = Date.now();
    
    // Проверяем, есть ли данные в кэше и не просрочены ли они
    if (
      cache.current[key] &&
      cache.current[key].expiresAt > now
    ) {
      return cache.current[key].data as T;
    }
    
    // Если нет данных в кэше или они просрочены, выполняем запрос
    try {
      const data = await fetchFn();
      
      // Сохраняем результат в кэше
      cache.current[key] = {
        data,
        timestamp: now,
        expiresAt: now + ttl
      };
      
      return data;
    } catch (error) {
      // Если возникла ошибка, удаляем возможные устаревшие данные из кэша
      delete cache.current[key];
      throw error;
    }
  }, []);
  
  /**
   * Очищает весь кэш или конкретный элемент
   */
  const clearCache = useCallback((key?: string) => {
    if (key) {
      delete cache.current[key];
    } else {
      cache.current = {};
    }
  }, []);
  
  /**
   * Обновляет данные в кэше для указанного ключа
   */
  const updateCache = useCallback(<T>(key: string, data: T, options: CacheOptions = {}) => {
    const { ttl = 5 * 60 * 1000 } = options;
    const now = Date.now();
    
    cache.current[key] = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
  }, []);
  
  return {
    cachedRequest,
    clearCache,
    updateCache
  };
} 