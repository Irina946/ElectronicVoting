import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { lazy, Suspense } from 'react';
import { Layout } from './layout';
import { CacheProvider } from './context/CacheContext';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { performanceMonitor } from './utils/performance';
import { withRenderTracking } from './hooks/useRenderTracking';

// Тип для props компонента ErrorFallback
type FallbackProps = {
    error: Error;
    resetError: () => void;
};

// Ленивая загрузка компонентов с трассировкой производительности
const Mail = withRenderTracking(
    lazy(() => import('./pages/admin/mail/mail').then(module => ({ default: module.Mail }))),
    'Mail'
);
const MessagePageAdmin = withRenderTracking(
    lazy(() => import('./pages/admin/messagePageAdmin/messagePageAdmin').then(module => ({ default: module.MessagePageAdmin }))),
    'MessagePageAdmin'
);
const NewMessage = withRenderTracking(
    lazy(() => import('./pages/admin/newMessage/newMessage').then(module => ({ default: module.NewMessage }))),
    'NewMessage'
);
const MailShareholder = withRenderTracking(
    lazy(() => import('./pages/user/mailShareholder/mailShareholder').then(module => ({ default: module.MailShareholder }))),
    'MailShareholder'
);
const Message = withRenderTracking(
    lazy(() => import('./pages/user/message/message').then(module => ({ default: module.Message }))),
    'Message'
);
const Broadcast = withRenderTracking(
    lazy(() => import('./pages/user/broadcast/broadcast').then(module => ({ default: module.Broadcast }))),
    'Broadcast'
);
const Voting = withRenderTracking(
    lazy(() => import('./pages/user/voting/voting').then(module => ({ default: module.Voting }))),
    'Voting'
);
const Authorization = withRenderTracking(
    lazy(() => import('./pages/authorization/authorization').then(module => ({ default: module.Authorization }))),
    'Authorization'
);
const Results = withRenderTracking(
    lazy(() => import('./pages/results/results').then(module => ({ default: module.Results }))),
    'Results'
);

// Компонент загрузки
const LoadingFallback = () => <div className="loading-container">Загрузка...</div>;

// Компонент для отображения ошибок
const ErrorFallback = ({ error, resetError }: FallbackProps) => (
    <div className="error-container">
        <h2>Произошла ошибка при загрузке компонента</h2>
        <p>{error.message}</p>
        <button onClick={resetError}>Попробовать снова</button>
    </div>
);

function App() {
    // Инициализация мониторинга производительности при запуске приложения
    performanceMonitor.measure('app_init', () => { });

    return (
        <ErrorBoundary>
            <CacheProvider>
                <BrowserRouter>
                    <AuthProvider>
                        <ErrorBoundary>
                            <Suspense fallback={<LoadingFallback />}>
                                <Routes>
                                    <Route path='/' element={<Authorization />} />
                                    <Route element={
                                        <PrivateRoute>
                                            <Layout />
                                        </PrivateRoute>
                                    }>
                                        {/* Маршруты администратора */}
                                        <Route path='/admin' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="admin">
                                                    <Mail />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/admin/meeting/:meetingID' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="admin">
                                                    <MessagePageAdmin />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/admin/meeting/:meetingID/results/:userID' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="admin">
                                                    <Results />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/admin/meeting/new' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="admin">
                                                    <NewMessage />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/admin/meeting/:meetingID/edit' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="admin">
                                                    <NewMessage />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />

                                        {/* Маршруты пользователя */}
                                        <Route path='/user' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="user">
                                                    <MailShareholder />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/user/meeting/:meetingID' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="user">
                                                    <Message />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/user/meeting/:meetingID/broadcast' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="user">
                                                    <Broadcast />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/user/meeting/:meetingID/voting/:userID' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="user">
                                                    <Voting />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                        <Route path='/user/meeting/:meetingID/result/:userID' element={
                                            <ErrorBoundary fallback={ErrorFallback}>
                                                <PrivateRoute requiredRole="user">
                                                    <Results />
                                                </PrivateRoute>
                                            </ErrorBoundary>
                                        } />
                                    </Route>
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>
                    </AuthProvider>
                </BrowserRouter>
            </CacheProvider>
        </ErrorBoundary>
    );
}

export default App;