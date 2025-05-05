import { ReactNode, createContext, useContext, useRef, useState } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheContextType {
  getCache: <T>(key: string) => T | null;
  setCache: <T>(key: string, data: T, ttl?: number) => void;
  clearCache: (key?: string) => void;
  invalidateCache: (pattern: string) => void;
}

// Создаем контекст с начальным значением
const CacheContext = createContext<CacheContextType | null>(null);

/**
 * Провайдер кэша для приложения
 */
export const CacheProvider = ({ children }: { children: ReactNode }) => {
  // Используем useRef для хранения кэша, чтобы он сохранялся между рендерами
  const cache = useRef<Record<string, CacheItem<unknown>>>({});
  // Используем useState для триггера перерисовки при изменении кэша
  const [, setUpdateTrigger] = useState(0);

  /**
   * Получает данные из кэша по ключу
   */
  const getCache = <T,>(key: string): T | null => {
    const now = Date.now();
    const cacheItem = cache.current[key];

    if (cacheItem && cacheItem.expiresAt > now) {
      return cacheItem.data as T;
    }

    // Если данные просрочены, удаляем их из кэша
    if (cacheItem) {
      delete cache.current[key];
    }

    return null;
  };

  /**
   * Устанавливает данные в кэш
   * @param key - ключ для кэширования
   * @param data - данные для кэширования
   * @param ttl - время жизни кэша в миллисекундах (по умолчанию 5 минут)
   */
  const setCache = <T,>(key: string, data: T, ttl = 5 * 60 * 1000) => {
    const now = Date.now();
    
    cache.current[key] = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
    
    // Триггерим перерисовку, если это необходимо
    setUpdateTrigger(prev => prev + 1);
  };

  /**
   * Очищает кэш полностью или по ключу
   */
  const clearCache = (key?: string) => {
    if (key) {
      delete cache.current[key];
    } else {
      cache.current = {};
    }
    
    setUpdateTrigger(prev => prev + 1);
  };

  /**
   * Инвалидирует кэш по паттерну в ключе
   * Например, invalidateCache('meeting_') удалит все ключи, начинающиеся с 'meeting_'
   */
  const invalidateCache = (pattern: string) => {
    let hasChanges = false;
    
    Object.keys(cache.current).forEach(key => {
      if (key.includes(pattern)) {
        delete cache.current[key];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setUpdateTrigger(prev => prev + 1);
    }
  };

  const value = {
    getCache,
    setCache,
    clearCache,
    invalidateCache
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

/**
 * Хук для доступа к контексту кэша
 */
export const useCache = (): CacheContextType => {
  const context = useContext(CacheContext);
  
  if (!context) {
    throw new Error('useCache должен использоваться внутри CacheProvider');
  }
  
  return context;
}; 