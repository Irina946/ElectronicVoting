import { Link } from "react-router";
import headerTop from "../../assets/header1.svg"
import headerCenter from "../../assets/header2.svg"

interface HeaderProps {
    path?: string
    title?: string
}
export const Header = (props: HeaderProps) => {
    const {path, title} = props
    return (
        <div className="flex flex-col justify-center items-center">
            <img src={headerTop} alt="Header" />
            <div className="bg-(--color-red) w-[100%] flex justify-center">
                <img src={headerCenter} alt="Header" />
            </div>
            <div className="bg-(--color-gray) w-[100%] h-[50px] align-middle flex justify-center">
                <div className="w-[1020px] text-base font-(--font-display) py-[15px] text-(--color-text)">
                    <u>Главная</u> / <u>Услуги</u> / Сервис - Личный кабинет / <Link
                        to={'/generalMeetingShareholders'}
                        className="cursor-pointer hover:border-b-[1px] hover:border-(--color-text)">
                        Сервис - Общее собрание акционеров
                    </Link> {path ? <Link to={path}>/ {title}</Link> : ''}
                </div>
            </div>
        </div>
    );
};