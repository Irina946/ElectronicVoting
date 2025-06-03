import { JSX } from "react";
import iconExport from "../../assets/get_app.svg";

interface ButtonParticipantsProps {
    title: string;
    onClick: () => void;
    color: 'yellow' | 'gray'
}

export const ButtonParticipants = (props: ButtonParticipantsProps): JSX.Element => {
    const { title, onClick, color } = props;

    return (
        <button
            onClick={onClick}
            className={`
                    text-(--color-black)
                    rounded-2xl
                    cursor-pointer
                    text-center
                    text-sm
                    border-(--color-border)
                    ${color === 'yellow'
                    ? "w-[160px] h-[30px] bg-(--color-yellow-button) hover:bg-(--color-yellow) focus:bg-(--color-yellow) active:bg-(--color-yellow)"
                    : "h-[40px] w-[220px] border-[2px] bg-(--color-white) hover:bg-(--color-button-two) focus:bg-(--color-button-two) active:bg-(--color-button-two) flex items-center justify-center gap-2"
                }
                    border-[1px]
                    `}>
            {title}
            {color === 'gray' && (
                <img src={iconExport} title="Скачать список собраний" className="!w-[20px] !h-[20px]" />
            )}
        </button>
    )
}