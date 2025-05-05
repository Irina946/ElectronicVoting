import { useCallback, useState } from 'react';
import { useRequestCache } from './useRequestCache';
import { performanceMonitor } from '../utils/performance';
import { useCache } from '../context/CacheContext';

interface RequestOptions {
    ttl?: number;
    forceRefresh?: boolean;
    disablePerformanceTracking?: boolean;
}

/**
 * Хук для оптимизированных запросов с кэшированием и мониторингом производительности
 * Объединяет функциональность useRequestCache и CacheContext, а также добавляет
 * отслеживание производительности и состояние загрузки
 */
export function useOptimizedRequest() {
    const { cachedRequest, clearCache } = useRequestCache();
    const { getCache, setCache, invalidateCache } = useCache();
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, Error | null>>({});

    /**
     * Выполняет запрос с кэшированием и мониторингом производительности
     * @param key Ключ для кэширования
     * @param fetchFn Асинхронная функция запроса
     * @param options Опции запроса
     */
    const optimizedRequest = useCallback(async <T>(
        key: string,
        fetchFn: () => Promise<T>,
        options: RequestOptions = {}
    ): Promise<T> => {
        const {
            ttl,
            forceRefresh = false,
            disablePerformanceTracking = false
        } = options;

        // Устанавливаем состояние загрузки
        setIsLoading(prev => ({ ...prev, [key]: true }));
        // Сбрасываем ошибку для этого ключа
        setErrors(prev => ({ ...prev, [key]: null }));

        try {
            // Пытаемся получить данные из глобального кэша, если нет принудительного обновления
            if (!forceRefresh) {
                const globalCacheData = getCache<T>(key);
                if (globalCacheData) {
                    setIsLoading(prev => ({ ...prev, [key]: false }));
                    return globalCacheData;
                }
            }

            // Измеряем производительность запроса, если включено отслеживание
            const executeRequest = async () => {
                try {
                    // Выполняем запрос с использованием кэша уровня компонента
                    const data = await cachedRequest<T>(
                        key,
                        fetchFn,
                        { ttl }
                    );

                    // Сохраняем результат в глобальном кэше
                    setCache<T>(key, data, ttl);

                    return data;
                } catch (error) {
                    // Сохраняем ошибку в состоянии
                    if (error instanceof Error) {
                        setErrors(prev => ({ ...prev, [key]: error }));
                    } else {
                        setErrors(prev => ({
                            ...prev,
                            [key]: new Error('Неизвестная ошибка при запросе')
                        }));
                    }
                    throw error;
                } finally {
                    // Устанавливаем состояние загрузки как false
                    setIsLoading(prev => ({ ...prev, [key]: false }));
                }
            };

            // Если отслеживание производительности отключено, выполняем запрос напрямую
            if (disablePerformanceTracking) {
                return executeRequest();
            }

            // Иначе используем мониторинг производительности
            return performanceMonitor.measureAsync(
                `request_${key}`,
                executeRequest
            );
        } catch (error) {
            console.error(`Ошибка при оптимизированном запросе для ключа ${key}:`, error);
            throw error;
        }
    }, [cachedRequest, getCache, setCache]);

    /**
     * Очищает кэш для указанного ключа во всех уровнях
     */
    const clearOptimizedCache = useCallback((key?: string) => {
        if (key) {
            clearCache(key);
            invalidateCache(key);
        } else {
            clearCache();
            invalidateCache('');
        }
    }, [clearCache, invalidateCache]);

    /**
     * Получает состояние загрузки для указанного ключа
     */
    const getLoadingState = useCallback((key: string) => {
        return isLoading[key] || false;
    }, [isLoading]);

    /**
     * Получает ошибку для указанного ключа
     */
    const getError = useCallback((key: string) => {
        return errors[key] || null;
    }, [errors]);

    return {
        optimizedRequest,
        clearOptimizedCache,
        isLoading: getLoadingState,
        getError
    };
} 