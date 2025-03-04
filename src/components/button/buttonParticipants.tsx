import { JSX } from "react";

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
                    w-[160px] 
                    h-[30px]
                    text-(--color-black)
                    rounded-2xl
                    cursor-pointer
                    text-center
                    text-sm
                    border-(--color-border)
                    ${color === 'yellow'
                    ? "bg-(--color-yellow-button) hover:bg-(--color-yellow) focus:bg-(--color-yellow) active:bg-(--color-yellow)"
                    : "bg-(--color-button) hover:bg-(--color-button-two) focus:bg-(--color-button-two) active:bg-(--color-button-two)"
                }
                    border-[1px]
                    `}>
            {title}
        </button>
    )
}