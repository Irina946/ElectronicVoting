import { memo, ComponentType, ReactNode, FC } from 'react';

// Функция для глубокого сравнения объектов
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEqual = (prevProps: Record<string, unknown>, nextProps: Record<string, unknown>): boolean => {
  if (prevProps === nextProps) return true;
  
  // Если один из них null или не объект, сравниваем строгим равенством
  if (
    prevProps === null || 
    nextProps === null || 
    typeof prevProps !== 'object' || 
    typeof nextProps !== 'object'
  ) {
    return prevProps === nextProps;
  }
  
  // Получаем ключи обоих объектов
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  // Если количество ключей разное, объекты разные
  if (prevKeys.length !== nextKeys.length) return false;
  
  // Проверяем каждый ключ и значение рекурсивно
  return prevKeys.every(key => {
    // Если ключ - функция, считаем, что функции равны (полагаемся, что они обернуты в useCallback)
    if (typeof prevProps[key] === 'function' && typeof nextProps[key] === 'function') {
      return true;
    }
    
    // Для остальных типов сравниваем рекурсивно
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isEqual(prevProps[key] as Record<string, unknown>, nextProps[key] as Record<string, unknown>);
  });
};

/**
 * HOC для создания мемоизированной версии компонента с глубоким сравнением props
 */
export function withMemo<P>(Component: ComponentType<P>, displayName?: string): ComponentType<P> {
  const MemoComponent = memo(Component, isEqual);
  
  if (displayName) {
    MemoComponent.displayName = `Memoized(${displayName})`;
  } else if (Component.displayName || Component.name) {
    MemoComponent.displayName = `Memoized(${Component.displayName || Component.name})`;
  }
  
  return MemoComponent;
}

/**
 * Обертка для хэдеров, футеров и других статичных компонентов
 */
export const StaticComponent: FC<{ children: ReactNode }> = memo(
  ({ children }) => <>{children}</>,
  () => true // Всегда возвращаем true, так как статические компоненты не нужно перерисовывать
);

/**
 * Обертка для компонентов со сложными props, требующими глубокого сравнения
 */
export const MemoWithDeepCompare: FC<{ children: ReactNode }> = memo(
  ({ children }) => <>{children}</>,
  isEqual
); 