import { matchPath, useLocation, useNavigate, useParams } from "react-router";
import headerTop from "../../assets/header1.svg"
import headerCenter from "../../assets/header2.svg"

// Определим константы для размеров изображений
const HEADER_TOP_WIDTH = 1050;
const HEADER_TOP_HEIGHT = 120;
const HEADER_CENTER_WIDTH = 1440;
const HEADER_CENTER_HEIGHT = 50;

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
        <header className="flex flex-col justify-center items-center w-full">
            {/* Первое изображение с явными размерами */}
            <div className="w-full flex justify-between items-center" style={{ height: HEADER_TOP_HEIGHT }}>
                <img 
                    src={headerTop} 
                    alt="Header logo" 
                    width={HEADER_TOP_WIDTH} 
                    height={HEADER_TOP_HEIGHT}
                    className="flex-1"
                    loading="eager" // Важно для приоритетной загрузки
                />
            </div>

            {/* Второе изображение с явными размерами */}
            <div className="bg-(--color-red) w-full flex justify-center" style={{ height: HEADER_CENTER_HEIGHT }}>
                <img 
                    src={headerCenter} 
                    alt="Header decoration" 
                    width={HEADER_CENTER_WIDTH} 
                    height={HEADER_CENTER_HEIGHT}
                    loading="eager" // Важно для приоритетной загрузки
                />
            </div>

            {/* Навигационный блок с фиксированной высотой */}
            <div className="bg-(--color-gray) w-full" style={{ height: '50px' }}>
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-[1020px] text-base font-(--font-display) text-(--color-text)">
                        <u>Главная</u> / <u>Услуги</u> / Сервис - Личный кабинет / {getBreadcrumbs()}
                    </div>
                </div>
            </div>
        </header>
    );
};