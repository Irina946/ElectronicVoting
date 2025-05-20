import { memo, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { useState, useEffect } from 'react';
import { performanceMonitor } from './utils/performance';

// Мемоизированные компоненты Header и Footer
const MemoizedHeader = memo(Header);
const MemoizedFooter = memo(Footer);

// Стили для предотвращения CLS
const layoutStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        minHeight: '100vh',
        width: '100%'
    },
    main: {
        flex: '1 0 auto',
        minHeight: '400px',
        width: '100%',
        contain: 'layout' as const
    }
};

export const Layout = () => {
    const [layoutRendered, setLayoutRendered] = useState<boolean>(false);

    // Отслеживаем производительность рендеринга Layout
    useEffect(() => {
        const measureId = performanceMonitor.startMeasure('layout_render');

        // Помечаем компонент как отрендеренный
        setLayoutRendered(true);

        return () => {
            performanceMonitor.endMeasure(measureId);
        };
    }, []);

    // Периодически отправляем метрики производительности на сервер (если это необходимо)
    useEffect(() => {
        if (!layoutRendered) return;

        // Настраиваем периодическую отправку метрик (каждые 5 минут)
        const metricsInterval = setInterval(() => {
            const metrics = performanceMonitor.getMetrics();
            if (metrics.length > 0) {
                console.info("Собрано метрик производительности:", metrics.length);
                // Для отправки на сервер раскомментируйте строку ниже
                // performanceMonitor.sendMetricsToServer('/api/performance-metrics');

                // Очищаем метрики после отправки
                performanceMonitor.clearMetrics();
            }
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(metricsInterval);
        };
    }, [layoutRendered]);

    const location = useLocation();

    // Мемоизируем значение, чтобы не пересчитывать при каждом рендере
    const shouldShowHeaderFooter = useMemo(() => {
        return location.pathname !== '/';
    }, [location.pathname]);

    return (
        <div className="layout-container" style={layoutStyles.container}>
            {shouldShowHeaderFooter && <MemoizedHeader />}
            <main style={layoutStyles.main}>
                <Outlet />
            </main>
            {shouldShowHeaderFooter && <MemoizedFooter />}
        </div>
    );
};