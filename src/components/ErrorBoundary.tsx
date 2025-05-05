import React, { Component, ErrorInfo, ReactNode } from 'react';
import { performanceMonitor } from '../utils/performance';

type FallbackProps = {
    error: Error;
    resetError: () => void;
};

// Отделяем функциональный fallback от стандартного ReactNode
type FallbackComponent = (props: FallbackProps) => ReactNode;
type FallbackType = ReactNode | FallbackComponent;

interface ErrorBoundaryProps {
    fallback?: FallbackType;
    children: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Компонент-обертка для обработки ошибок в приложении
 * Перехватывает ошибки, возникающие в дочерних компонентах,
 * и отображает запасной UI вместо упавшего дерева компонентов
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Обновляем состояние, чтобы следующий рендер показал запасной UI
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Логируем ошибку
        console.error('Перехваченная ошибка:', error, errorInfo);

        // Регистрируем ошибку в системе мониторинга производительности
        performanceMonitor.measure('ErrorBoundary.componentDidCatch', () => { }, {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });

        // Вызываем обработчик ошибок, если он предоставлен
        this.props.onError?.(error, errorInfo);
    }

    resetError = (): void => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Отображаем запасной UI
            if (this.props.fallback) {
                if (typeof this.props.fallback === 'function' && this.state.error) {
                    const FallbackComponent = this.props.fallback as FallbackComponent;
                    return FallbackComponent({
                        error: this.state.error,
                        resetError: this.resetError
                    });
                }
                return this.props.fallback as Exclude<ReactNode, FallbackComponent>;
            }

            // Если запасной UI не предоставлен, показываем стандартное сообщение об ошибке
            return (
                <div className="error-boundary-fallback">
                    <h2>Произошла ошибка</h2>
                    <p>Что-то пошло не так. Пожалуйста, попробуйте перезагрузить страницу.</p>
                    <button onClick={this.resetError}>Попробовать снова</button>
                    {process.env.NODE_ENV !== 'production' && this.state.error && (
                        <details>
                            <summary>Информация об ошибке</summary>
                            <p>{this.state.error.toString()}</p>
                            <pre>{this.state.error.stack}</pre>
                        </details>
                    )}
                </div>
            );
        }

        // Если ошибок нет, отображаем дочерние компоненты
        return this.props.children;
    }
}

/**
 * HOC для оборачивания компонента в ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'> = {}
): React.FC<P> {
    const WithErrorBoundary: React.FC<P> = (props) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    const displayName = Component.displayName || Component.name || 'Component';
    WithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;

    return WithErrorBoundary;
}

export default ErrorBoundary; 