import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { lazy, Suspense } from 'react';
import { Layout } from './layout';
import { CacheProvider } from './context/CacheContext';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';

// Ленивая загрузка компонентов
const Mail = lazy(() => import('./pages/admin/mail/mail').then(module => ({ default: module.Mail })));
const MessagePageAdmin = lazy(() => import('./pages/admin/messagePageAdmin/messagePageAdmin').then(module => ({ default: module.MessagePageAdmin })));
const NewMessage = lazy(() => import('./pages/admin/newMessage/newMessage').then(module => ({ default: module.NewMessage })));
const MailShareholder = lazy(() => import('./pages/user/mailShareholder/mailShareholder').then(module => ({ default: module.MailShareholder })));
const Message = lazy(() => import('./pages/user/message/message').then(module => ({ default: module.Message })));
const Broadcast = lazy(() => import('./pages/user/broadcast/broadcast').then(module => ({ default: module.Broadcast })));
const Voting = lazy(() => import('./pages/user/voting/voting').then(module => ({ default: module.Voting })));
const Authorization = lazy(() => import('./pages/authorization/authorization').then(module => ({ default: module.Authorization })));
const Results = lazy(() => import('./pages/results/results').then(module => ({ default: module.Results })));

// Компонент загрузки
const LoadingFallback = () => <div className="loading-container">Загрузка...</div>;

function App() {
    return (
        <CacheProvider>
            <BrowserRouter>
                <AuthProvider>
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
                                    <PrivateRoute requiredRole="admin">
                                        <Mail />
                                    </PrivateRoute>
                                } />
                                <Route path='/admin/meeting/:meetingID' element={
                                    <PrivateRoute requiredRole="admin">
                                        <MessagePageAdmin />
                                    </PrivateRoute>
                                } />
                                <Route path='/admin/meeting/:meetingID/results/:userID' element={
                                    <PrivateRoute requiredRole="admin">
                                        <Results />
                                    </PrivateRoute>
                                } />
                                <Route path='/admin/meeting/new' element={
                                    <PrivateRoute requiredRole="admin">
                                        <NewMessage />
                                    </PrivateRoute>
                                } />
                                <Route path='/admin/meeting/:meetingID/edit' element={
                                    <PrivateRoute requiredRole="admin">
                                        <NewMessage />
                                    </PrivateRoute>
                                } />

                                {/* Маршруты пользователя */}
                                <Route path='/user' element={
                                    <PrivateRoute requiredRole="user">
                                        <MailShareholder />
                                    </PrivateRoute>
                                } />
                                <Route path='/user/meeting/:meetingID' element={
                                    <PrivateRoute requiredRole="user">
                                        <Message />
                                    </PrivateRoute>
                                } />
                                <Route path='/user/meeting/:meetingID/broadcast' element={
                                    <PrivateRoute requiredRole="user">
                                        <Broadcast />
                                    </PrivateRoute>
                                } />
                                <Route path='/user/meeting/:meetingID/voting/:userID' element={
                                    <PrivateRoute requiredRole="user">
                                        <Voting />
                                    </PrivateRoute>
                                } />
                                <Route path='/user/meeting/:meetingID/result/:userID' element={
                                    <PrivateRoute requiredRole="user">
                                        <Results />
                                    </PrivateRoute>
                                } />
                            </Route>
                        </Routes>
                    </Suspense>
                </AuthProvider>
            </BrowserRouter>
        </CacheProvider>
    );
}

export default App;