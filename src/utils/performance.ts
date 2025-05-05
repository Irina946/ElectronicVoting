import React from 'react';

/**
 * Утилита для мониторинга производительности приложения
 */

// Хранилище для метрик
interface PerformanceMetric {
    name: string;
    startTime: number;
    duration?: number;
    metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
    private metrics: PerformanceMetric[] = [];
    private readonly MAX_METRICS = 100;
    private isEnabled = true;

    /**
     * Начать измерение операции
     * @param name Название операции
     * @param metadata Дополнительные данные
     * @returns Идентификатор измерения для использования в endMeasure
     */
    startMeasure(name: string, metadata?: Record<string, unknown>): string {
        if (!this.isEnabled) return name;

        const id = `${name}_${Date.now()}`;
        this.metrics.push({
            name,
            startTime: performance.now(),
            metadata
        });

        // Ограничиваем количество хранимых метрик
        if (this.metrics.length > this.MAX_METRICS) {
            this.metrics.shift();
        }

        return id;
    }

    /**
     * Завершить измерение операции
     * @param id Идентификатор измерения из startMeasure
     * @returns Длительность операции в миллисекундах или undefined, если измерение не найдено
     */
    endMeasure(id: string): number | undefined {
        if (!this.isEnabled) return undefined;

        const name = id.split('_')[0];
        const metricIndex = this.metrics.findIndex(m =>
            m.name === name && !m.duration
        );

        if (metricIndex === -1) return undefined;

        const duration = performance.now() - this.metrics[metricIndex].startTime;
        this.metrics[metricIndex].duration = duration;

        // Если длительность операции больше порогового значения, логируем ее
        if (duration > 500) {
            console.warn(`Медленная операция: ${name} заняла ${duration.toFixed(2)}ms`, this.metrics[metricIndex].metadata);
        }

        return duration;
    }

    /**
     * Измерить длительность асинхронной функции
     * @param name Название операции
     * @param fn Асинхронная функция для измерения
     * @param metadata Дополнительные данные
     * @returns Результат выполнения функции
     */
    async measureAsync<T>(
        name: string,
        fn: () => Promise<T>,
        metadata?: Record<string, unknown>
    ): Promise<T> {
        if (!this.isEnabled) return fn();

        const id = this.startMeasure(name, metadata);
        try {
            const result = await fn();
            this.endMeasure(id);
            return result;
        } catch (error) {
            this.endMeasure(id);
            throw error;
        }
    }

    /**
     * Измерить длительность синхронной функции
     * @param name Название операции
     * @param fn Синхронная функция для измерения
     * @param metadata Дополнительные данные
     * @returns Результат выполнения функции
     */
    measure<T>(
        name: string,
        fn: () => T,
        metadata?: Record<string, unknown>
    ): T {
        if (!this.isEnabled) return fn();

        const id = this.startMeasure(name, metadata);
        try {
            const result = fn();
            this.endMeasure(id);
            return result;
        } catch (error) {
            this.endMeasure(id);
            throw error;
        }
    }

    /**
     * Получить все метрики
     */
    getMetrics(): PerformanceMetric[] {
        return [...this.metrics];
    }

    /**
     * Получить метрики по имени операции
     */
    getMetricsByName(name: string): PerformanceMetric[] {
        return this.metrics.filter(m => m.name === name);
    }

    /**
     * Очистить все метрики
     */
    clearMetrics(): void {
        this.metrics = [];
    }

    /**
     * Включить или выключить мониторинг
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }

    /**
     * Получить среднюю длительность операции по имени
     */
    getAverageDuration(name: string): number | null {
        const metrics = this.getMetricsByName(name).filter(m => m.duration !== undefined);

        if (metrics.length === 0) return null;

        const sum = metrics.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        return sum / metrics.length;
    }

    /**
     * Отправить собранные метрики на сервер аналитики
     * @param endpoint URL для отправки метрик
     */
    async sendMetricsToServer(endpoint: string): Promise<void> {
        if (this.metrics.length === 0) return;

        try {
            const metricsToSend = this.metrics.filter(m => m.duration !== undefined);

            if (metricsToSend.length > 0) {
                await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        metrics: metricsToSend,
                        timestamp: Date.now(),
                        userAgent: navigator.userAgent
                    })
                });
            }
        } catch (error) {
            console.error('Не удалось отправить метрики:', error);
        }
    }
}

// Создаем и экспортируем глобальный экземпляр
export const performanceMonitor = new PerformanceMonitor();

// Хук для замера рендеринга компонентов React
export function withPerformanceTracking<P extends object, T extends React.ComponentType<P>>(
    Component: T,
    componentName: string
): T {
    // Создаем HOC для отслеживания производительности
    const WithPerformanceTracking = (props: P) => {
        const measureId = React.useRef<string>();

        React.useEffect(() => {
            // Отмечаем начало рендеринга
            measureId.current = performanceMonitor.startMeasure(
                `render_${componentName}`,
                { props: JSON.stringify(props) }
            );

            return () => {
                // Отмечаем конец рендеринга при размонтировании
                if (measureId.current) {
                    performanceMonitor.endMeasure(measureId.current);
                }
            };
        }, [props]);

        return React.createElement(Component, props);
    };

    WithPerformanceTracking.displayName = `WithPerformanceTracking(${componentName})`;

    return WithPerformanceTracking as unknown as T;
}

// Декоратор для измерения времени выполнения метода класса
export function measureMethod(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        const className = this.constructor.name;
        const methodName = propertyKey;
        const id = performanceMonitor.startMeasure(`${className}.${methodName}`);

        try {
            const result = originalMethod.apply(this, args);

            // Проверяем, является ли результат промисом
            if (result instanceof Promise) {
                return result.finally(() => {
                    performanceMonitor.endMeasure(id);
                });
            }

            performanceMonitor.endMeasure(id);
            return result;
        } catch (error) {
            performanceMonitor.endMeasure(id);
            throw error;
        }
    };

    return descriptor;
} 