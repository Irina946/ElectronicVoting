import { login, refreshToken, getCurrentUser, isAuthenticated, isAdmin, isTokenExpired } from './auth';
import axios from 'axios';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Определяем тип для модуля auth
interface AuthModule {
    login: typeof login;
    refreshToken: typeof refreshToken;
    getCurrentUser: typeof getCurrentUser;
    isAuthenticated: typeof isAuthenticated;
    isAdmin: typeof isAdmin;
    isTokenExpired: typeof isTokenExpired;
}

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Мокаем localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
    removeItem: jest.fn()
} as Storage;

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Мокируем atob для тестирования decodeJwt
global.atob = jest.fn(
    (str: string) => Buffer.from(str, 'base64').toString('binary')
) as unknown as typeof global.atob;

describe('Auth Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Мокируем функцию isAxiosError в каждом тесте
        jest.spyOn(axios, 'isAxiosError').mockImplementation(() => false);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    describe('login', () => {
        it('должен успешно выполнить вход и сохранить токены', async () => {
            const mockResponse = {
                data: {
                    access: 'access_token',
                    refresh: 'refresh_token',
                    is_staff: true
                }
            };
            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await login('testuser', 'password');

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/api/token/',
                { username: 'testuser', password: 'password' }
            );
            expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify('access_token'));
            expect(localStorage.setItem).toHaveBeenCalledWith('refresh', JSON.stringify('refresh_token'));
            expect(localStorage.setItem).toHaveBeenCalledWith('accountType', JSON.stringify('admin'));
            expect(result).toEqual({ success: true, isStaff: true });
        });

        it('должен обработать ошибку при неудачном входе', async () => {
            const error = new Error('Ошибка входа');
            mockedAxios.post.mockRejectedValue(error);

            const result = await login('testuser', 'wrongpassword');

            expect(result).toEqual({ success: false, error });
        });
    });

    describe('refreshToken', () => {
        beforeEach(() => {
            // Устанавливаем для каждого теста новый refresh и access token
            (localStorage.getItem as jest.Mock).mockImplementation((key) => {
                if (key === 'refresh') return JSON.stringify('refresh_token');
                if (key === 'user') return JSON.stringify('access_token');
                return null;
            });

            // Мокируем isTokenExpired для разных сценариев
            jest.spyOn(jest.requireActual<AuthModule>('./auth'), 'isTokenExpired')
                .mockImplementation(() => true);
        });

        it('должен успешно обновить токен (формат access/refresh)', async () => {
            const mockResponse = {
                data: {
                    access: 'new_access_token',
                    refresh: 'new_refresh_token'
                }
            };

            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await refreshToken();

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/api/token/refresh/',
                { refresh: 'refresh_token' }
            );
            expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify('new_access_token'));
            expect(localStorage.setItem).toHaveBeenCalledWith('refresh', JSON.stringify('new_refresh_token'));
            expect(result).toBe(true);
        });

        it('должен успешно обновить токен (формат access_token/refresh_token)', async () => {
            const mockResponse = {
                data: {
                    access_token: 'new_access_token',
                    refresh_token: 'new_refresh_token'
                }
            };

            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await refreshToken();

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/api/token/refresh/',
                { refresh: 'refresh_token' }
            );
            expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify('new_access_token'));
            expect(localStorage.setItem).toHaveBeenCalledWith('refresh', JSON.stringify('new_refresh_token'));
            expect(result).toBe(true);
        });

        it('должен вернуть true, если токен не просрочен', async () => {
            // Переопределяем isTokenExpired только для этого теста
            jest.spyOn(jest.requireActual<AuthModule>('./auth'), 'isTokenExpired')
                .mockImplementation(() => false);

            const result = await refreshToken();

            // Проверяем, что запрос на обновление не был вызван
            expect(mockedAxios.post).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('должен обработать ошибку при отсутствии refresh токена', async () => {
            (localStorage.getItem as jest.Mock).mockImplementation((key) => {
                if (key === 'user') return JSON.stringify('access_token');
                return null;
            });

            const result = await refreshToken();

            expect(result).toBe(false);
            // Теперь не ожидаем вызова localStorage.removeItem, так как функция logout удалена
        });

        it('должен обработать ошибку при отсутствии access токена', async () => {
            (localStorage.getItem as jest.Mock).mockImplementation((key) => {
                if (key === 'refresh') return JSON.stringify('refresh_token');
                return null;
            });

            const result = await refreshToken();

            expect(result).toBe(false);
            // Теперь не ожидаем вызова localStorage.removeItem, так как функция logout удалена
        });

        it('должен обработать ошибку 500 от сервера без выхода', async () => {
            const error = new Error('Internal Server Error');
            mockedAxios.post.mockRejectedValue(error);

            // Возвращаем true для этого конкретного теста
            jest.spyOn(axios, 'isAxiosError').mockImplementation(() => true);

            // Симулируем проверку статуса ответа
            Object.defineProperty(error, 'response', {
                value: { status: 500 }
            });

            const result = await refreshToken();

            expect(result).toBe(false);
            expect(localStorage.removeItem).not.toHaveBeenCalled();
        });

        it('должен обработать ошибку 401 без выхода из системы', async () => {
            const error = new Error('Unauthorized');
            mockedAxios.post.mockRejectedValue(error);

            // Устанавливаем isAxiosError в true для этого теста
            jest.spyOn(axios, 'isAxiosError').mockImplementation(() => true);

            // Симулируем 401 ответ
            Object.defineProperty(error, 'response', {
                value: { status: 401 }
            });

            const result = await refreshToken();

            expect(result).toBe(false);
            // Теперь не ожидаем вызова localStorage.removeItem, так как функция logout удалена
        });

        it('должен обработать другие ошибки без выхода', async () => {
            const error = new Error('Ошибка обновления токена');
            mockedAxios.post.mockRejectedValue(error);

            // Убедимся, что isAxiosError вернет false для этого теста
            jest.spyOn(axios, 'isAxiosError').mockImplementation(() => false);

            const result = await refreshToken();

            expect(result).toBe(false);
            // Теперь не ожидаем вызова localStorage.removeItem, так как функция logout удалена
        });
    });

    describe('isTokenExpired', () => {
        it('должен вернуть true для просроченного токена', () => {
            // Создаем просроченный токен (exp в прошлом)
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzI1MjgwMDAsImlhdCI6MTY3MjUyODAwMH0.mock_signature';
            
            const result = isTokenExpired(expiredToken);

            expect(result).toBe(true);
        });

        it('должен вернуть false для действительного токена', () => {
            // Создаем валидный токен (exp в далеком будущем - 2030 год)
            const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MTI0MjgwMDAsImlhdCI6MTY3MjUyODAwMH0.mock_signature';
            
            const result = isTokenExpired(validToken);

            expect(result).toBe(false);
        });

        it('должен вернуть true если отсутствует поле exp', () => {
            // Создаем токен без поля exp
            const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzI1MjgwMDB9.mock_signature';
            
            const result = isTokenExpired(tokenWithoutExp);

            expect(result).toBe(true);
        });
    });

    describe('getCurrentUser', () => {
        it('должен вернуть текущего пользователя', () => {
            const mockUser = { id: 1, username: 'testuser' };
            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockUser));

            const result = getCurrentUser();

            expect(result).toEqual(mockUser);
        });

        it('должен вернуть null если пользователь не авторизован', () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            const result = getCurrentUser();

            expect(result).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('должен вернуть true если токен существует и не просрочен', () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify('valid_token'));

            // Мокируем isTokenExpired чтобы вернуть false (токен действителен)
            jest.spyOn(jest.requireActual<AuthModule>('./auth'), 'isTokenExpired')
                .mockImplementation(() => false);

            const result = isAuthenticated();

            expect(result).toBe(true);
        });

        it('должен вернуть true и инициировать обновление, если токен просрочен', () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify('expired_token'));

            // Мокируем isTokenExpired чтобы вернуть true (токен просрочен)
            jest.spyOn(jest.requireActual<AuthModule>('./auth'), 'isTokenExpired')
                .mockImplementation(() => true);

            // Мокируем refreshToken чтобы избежать реального вызова
            jest.spyOn(jest.requireActual<AuthModule>('./auth'), 'refreshToken')
                .mockImplementation(() => Promise.resolve(true));

            const result = isAuthenticated();

            expect(result).toBe(true);
        });

        it('должен вернуть false если токен отсутствует', () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            const result = isAuthenticated();

            expect(result).toBe(false);
        });
    });

    describe('isAdmin', () => {
        it('должен вернуть true если пользователь администратор', () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(true));

            const result = isAdmin();

            expect(result).toBe(true);
        });

        it('должен вернуть false если пользователь не администратор', () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(false));

            const result = isAdmin();

            expect(result).toBe(false);
        });

        it('должен вернуть false если информация о пользователе отсутствует', () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            const result = isAdmin();

            expect(result).toBe(false);
        });
    });
}); 