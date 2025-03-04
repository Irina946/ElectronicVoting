import { JSX } from "react";

interface ButtonMessageAdminProps {
    title: string;
    onClick: () => void;
    isSelected: boolean;
}

export const ButtonMessageAdmin = (props: ButtonMessageAdminProps): JSX.Element => {
    const { title, onClick, isSelected } = props;

    return (
        <button
            onClick={onClick}
            disabled={isSelected}
            className={`
                    w-[160px] 
                    h-[40px]
                    text-(--color-black)
                    rounded-2xl
                    cursor-pointer
                    text-center
                    text-base
                    font-bold
                    bg-(--color-yellow-button)
                    border-(--color-border)
                    border-[1px]
                    shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
                    hover:bg-(--color-yellow)
                    focus:bg-(--color-yellow)
                    active:bg-(--color-yellow)
                    active:shadow-none
                    disabled:bg-(--color-yellow)
                    disabled:shadow-none
                    disabled:cursor-auto
                    `}>
            {title}
        </button>
    )
}