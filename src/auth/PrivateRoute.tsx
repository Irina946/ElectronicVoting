import { FC, ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin, isAuthenticated } from './auth';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user'; // Опциональный параметр для проверки роли
}

/**
 * Компонент для защиты приватных маршрутов
 * Проверяет наличие токена авторизации и соответствие роли (если требуется)
 */
export const PrivateRoute: FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем токен и роль
        const authenticated = isAuthenticated();
        const adminStatus = isAdmin();
        
        // Если пользователь не аутентифицирован, нет доступа
        if (!authenticated) {
          setHasAccess(false);
          setIsLoading(false);
          return;
        }
        
        // Проверка роли, если она требуется
        if (requiredRole) {
          const hasRequiredRole = 
            (requiredRole === 'admin' && adminStatus) || 
            (requiredRole === 'user' && !adminStatus);
          
          if (!hasRequiredRole) {
            setHasAccess(false);
            setIsLoading(false);
            return;
          }
        }
        
        // Пользователь аутентифицирован и имеет нужную роль
        setHasAccess(true);
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, location.pathname]);

  if (isLoading) {
    // Пока проверяем аутентификацию, показываем загрузку
    return <div className="loading-container">Проверка авторизации...</div>;
  }

  if (!hasAccess) {
    // Если пользователь не аутентифицирован или не имеет нужной роли, перенаправляем на страницу входа
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Если пользователь аутентифицирован и имеет нужную роль, показываем защищенный контент
  return <>{children}</>;
}; 