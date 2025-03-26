import { Link, matchPath, useLocation } from "react-router";
import headerTop from "../../assets/header1.svg"
import headerCenter from "../../assets/header2.svg"

interface RouteConfig {
    path: string;
    text: string;
    pathPrev: string;
    pathNext?: string;
}

const routes: RouteConfig[] = [
    { path: "/admin", text: "", pathPrev: "/" },
    { path: "/admin/meeting/new", text: "Создать сообщение", pathPrev: "/admin" },
    { path: "/admin/meeting/:meetingID", text: "Собрание", pathPrev: "/admin" },
    { path: "/admin/meeting/:meetingID/edit", text: "Редактировать сообщение", pathPrev: "/admin" },
    { path: "/admin/meeting/:meetingID/results/:userID", text: "Результаты участника", pathPrev: "/admin/meeting/:meetingID" },
    { path: "/user", text: "", pathPrev: "/" },
    { path: "/user/meeting/:meetingID", text: "Сообщение", pathPrev: "/user" },
    { path: "/user/meeting/:meetingID/broadcast", text: "Трансляция собрания", pathPrev: "/user/meeting/:meetingID" },
    { path: "/user/meeting/:meetingID/voting/:userID", text: "Голосование", pathPrev: "/user/meeting/:meetingID" }
];

export const Header = () => {

    const location = useLocation();

    const currentRoute = routes.find(route => matchPath(route.path, location.pathname));

    return (
        <div className="flex flex-col justify-center items-center">
            <img src={headerTop} alt="Header" />
            <div className="bg-(--color-red) w-[100%] flex justify-center">
                <img src={headerCenter} alt="Header" />
            </div>
            <div className="bg-(--color-gray) w-[100%] h-[50px] align-middle flex justify-center">
                <div className="w-[1020px] text-base font-(--font-display) py-[15px] text-(--color-text)">
                    <u>Главная</u> / <u>Услуги</u> / Сервис - Личный кабинет / <Link
                        to={currentRoute?.pathPrev || '/'}
                        className="cursor-pointer hover:border-b-[1px] hover:border-(--color-text)">
                        Сервис - Общее собрание акционеров
                    </Link> {currentRoute?.path ? <Link to={currentRoute.path}>/ {currentRoute.text}</Link> : ''}
                </div>
            </div>
        </div>
    );
};