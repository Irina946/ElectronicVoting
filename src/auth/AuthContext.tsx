import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { login as authLogin, isAuthenticated as checkAuth, isAdmin as checkAdmin } from './auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: unknown }>;
    loading: boolean;
}

// Создаем контекст авторизации с начальными значениями
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isAdmin: false,
    login: async () => ({ success: false }),
    loading: true
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // Функция для обновления состояния авторизации из localStorage
    const updateAuthState = () => {
        try {
            const authenticated = checkAuth();
            const adminStatus = checkAdmin();

            setIsAuthenticated(authenticated);
            setIsAdmin(adminStatus);
        } catch (error) {
            console.error('Ошибка при проверке авторизации:', error);
            setIsAuthenticated(false);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    // Проверяем состояние авторизации при загрузке компонента
    useEffect(() => {
        updateAuthState();

        // Добавляем слушатель для обновления состояния при изменении localStorage
        const handleStorageChange = () => {
            updateAuthState();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Функция входа в систему
    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            const result = await authLogin(username, password);

            if (result.success) {
                updateAuthState(); // Обновляем состояние авторизации

                // Перенаправляем пользователя на соответствующую страницу
                navigate(result.isStaff ? '/admin' : '/user');
            }

            return result;
        } catch (error) {
            console.error('Ошибка при входе:', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    // Предоставляем значения контекста для всего приложения
    const value = {
        isAuthenticated,
        isAdmin,
        login,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для удобного использования контекста авторизации
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }

    return context;
}; 