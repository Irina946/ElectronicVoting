import { login, logout, refreshToken, getCurrentUser } from './auth';
import axios from 'axios';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

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

describe('Auth Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
            expect(localStorage.setItem).toHaveBeenCalledWith('accountType', JSON.stringify(true));
            expect(result).toEqual({ success: true, isStaff: true });
        });

        it('должен обработать ошибку при неудачном входе', async () => {
            mockedAxios.post.mockRejectedValue(new Error('Ошибка входа'));

            const result = await login('testuser', 'wrongpassword');

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('logout', () => {
        it('должен очистить localStorage', () => {
            logout();
            expect(localStorage.clear).toHaveBeenCalled();
        });
    });

    describe('refreshToken', () => {
        it('должен успешно обновить токен', async () => {
            const mockRefreshToken = 'refresh_token';
            const mockResponse = {
                data: {
                    access_token: 'new_access_token',
                    refresh_token: 'new_refresh_token'
                }
            };

            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockRefreshToken));
            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await refreshToken();

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/api/token//refresh',
                { refresh: mockRefreshToken }
            );
            expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify('new_access_token'));
            expect(localStorage.setItem).toHaveBeenCalledWith('refresh', JSON.stringify('new_refresh_token'));
            expect(result).toBe(true);
        });

        it('должен обработать ошибку при отсутствии refresh токена', async () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            const result = await refreshToken();

            expect(result).toBe(false);
            expect(localStorage.clear).toHaveBeenCalled();
        });
    });

    describe('getCurrentUser', () => {
        it('должен вернуть текущего пользователя', () => {
            const mockUser = { id: 1, username: 'testuser' };
            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockUser));

            const result = getCurrentUser();

            expect(result).toEqual(mockUser);
        });
    });
}); 