import { matchPath, useLocation, useNavigate, useParams } from "react-router";
import headerTop from "../../assets/header1.svg"
import headerCenter from "../../assets/header2.svg"
import { useAuth } from "../../auth/AuthContext";

interface RouteConfig {
    path: string;
    text: string;
    pathPrev: string;
    pathNext?: string;
    breadcrumbs?: Array<{path: string; text: string;}>;
}

const routes: RouteConfig[] = [
    { path: "/admin", text: "", pathPrev: "/" },
    { 
        path: "/admin/meeting/new", 
        text: "Создать сообщение", 
        pathPrev: "/admin",
        breadcrumbs: [
            { path: "/admin", text: "Общее собрание акционеров" }
        ]
    },
    { path: "/admin/meeting/:meetingID", text: "Собрание", pathPrev: "/admin" },
    { 
        path: "/admin/meeting/:meetingID/edit", 
        text: "Редактировать сообщение", 
        pathPrev: "/admin",
        breadcrumbs: [
            { path: "/admin", text: "Общее собрание акционеров" }
        ]
    },
    { path: "/admin/meeting/:meetingID/results/:userID", text: "Результаты участника", pathPrev: "/admin/meeting/:meetingID" },
    { path: "/user", text: "", pathPrev: "/" },
    { path: "/user/meeting/:meetingID", text: "Сообщение", pathPrev: "/user" },
    { path: "/user/meeting/:meetingID/broadcast", text: "Трансляция собрания", pathPrev: "/user/meeting/:meetingID" },
    { path: "/user/meeting/:meetingID/voting/:userID", text: "Голосование", pathPrev: "/user/meeting/:meetingID" },
    { path: "/user/meeting/:meetingID/result/:userID", text: "Результаты голосования", pathPrev: "/user/meeting/:meetingID", pathNext: "/user/meeting/:meetingID/voting/:userID" }
];

export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const { logout, isAdmin } = useAuth();

    const currentRoute = routes.find(route => matchPath(route.path, location.pathname));

    const getPathWithParams = (path: string) => {
        if (!path) return '/';
        
        // Сохраняем meetingID для всех маршрутов, где он используется
        if (params.meetingID) {
            return path.replace(/:(\w+)/g, (match: string, param: string) => {
                if (param === 'meetingID') return params.meetingID || match;
                return params[param] || match;
            });
        }
        
        return path;
    };

    const handleNavigation = (path: string) => {
        const pathWithParams = getPathWithParams(path);
        navigate(pathWithParams);
    };

    // Обработчик для выхода из системы
    const handleLogout = () => {
        logout();
    };

    // Определяем хлебные крошки для текущего маршрута
    const getBreadcrumbs = () => {
        if (!currentRoute) return null;
        
        // Если есть специально определенные хлебные крошки, используем их
        if (currentRoute.breadcrumbs) {
            return (
                <>
                    {currentRoute.breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            <span 
                                onClick={() => handleNavigation(crumb.path)}
                                className="cursor-pointer hover:border-b-[1px] hover:border-(--color-text)"
                            >
                                {crumb.text}
                            </span>
                            {" / "}
                        </span>
                    ))}
                    <span>{currentRoute.text}</span>
                </>
            );
        }
        
        // Иначе используем стандартную логику с pathPrev
        return (
            <>
                <span
                    onClick={() => handleNavigation(currentRoute.pathPrev || '/')}
                    className="cursor-pointer hover:border-b-[1px] hover:border-(--color-text)"
                >
                    Сервис - Общее собрание акционеров
                </span>
                {currentRoute.text && (
                    <span> / {currentRoute.text}</span>
                )}
                {currentRoute.pathNext && (
                    <span className="ml-2">
                        {" / "}
                        <span
                            onClick={() => handleNavigation(currentRoute.pathNext || '/')}
                            className="cursor-pointer hover:border-b-[1px] hover:border-(--color-text)"
                        >
                            Вернуться к голосованию
                        </span>
                    </span>
                )}
            </>
        );
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full flex justify-between items-center">
                <img src={headerTop} alt="Header" className="flex-1" />
                <div className="px-4 flex items-center">
                    <div className="text-base text-(--color-text) mr-2">
                        {isAdmin ? 'Администратор' : 'Пользователь'}
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-(--color-red) text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                    >
                        Выйти
                    </button>
                </div>
            </div>
            <div className="bg-(--color-red) w-[100%] flex justify-center">
                <img src={headerCenter} alt="Header" />
            </div>
            <div className="bg-(--color-gray) w-[100%] h-[50px] align-middle flex justify-center">
                <div className="w-[1020px] text-base font-(--font-display) py-[15px] text-(--color-text)">
                    <u>Главная</u> / <u>Услуги</u> / Сервис - Личный кабинет / {getBreadcrumbs()}
                </div>
            </div>
        </div>
    );
};