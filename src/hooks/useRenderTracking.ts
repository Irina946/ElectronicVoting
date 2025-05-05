import { useEffect, useRef } from 'react';
import React from 'react';
import { performanceMonitor } from '../utils/performance';

/**
 * Хук для трассировки времени рендеринга компонентов
 * 
 * @param componentName Название компонента для отслеживания
 * @param deps Зависимости для повторного измерения (опционально)
 */
export const useRenderTracking = (componentName: string, deps: React.DependencyList = []) => {
  const measureId = useRef<string>();
  const renderCount = useRef<number>(0);

  // При первом рендере и при изменении зависимостей
  useEffect(() => {
    renderCount.current += 1;
    
    // При первом рендере или изменении зависимостей начинаем новое измерение
    measureId.current = performanceMonitor.startMeasure(
      `render_${componentName}`,
      { renderCount: renderCount.current }
    );
    
    return () => {
      // При размонтировании или перед повторным рендерингом завершаем измерение
      if (measureId.current) {
        const duration = performanceMonitor.endMeasure(measureId.current);
        
        // Если время рендеринга больше порогового значения, логируем предупреждение
        if (duration && duration > 100) {
          console.warn(
            `Медленный рендеринг компонента ${componentName}: ${duration.toFixed(2)}ms`,
            { renderCount: renderCount.current }
          );
        }
      }
    };
  }, deps);

  // При размонтировании
  useEffect(() => {
    return () => {
      performanceMonitor.measure(
        `unmount_${componentName}`,
        () => {},
        { totalRenders: renderCount.current }
      );
    };
  }, [componentName]);
};

/**
 * HOC для автоматического применения хука useRenderTracking к компоненту
 */
export const withRenderTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> => {
  const displayName = componentName || Component.displayName || Component.name || 'Component';
  
  const WithRenderTracking: React.FC<P> = (props) => {
    useRenderTracking(displayName);
    return React.createElement(Component, props);
  };
  
  WithRenderTracking.displayName = `WithRenderTracking(${displayName})`;
  
  return WithRenderTracking;
}; 