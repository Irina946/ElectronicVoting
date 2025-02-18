import { JSX } from "react"
import styles from "./button.module.css"

interface ButtonMessageProps {
    title: string;
    onClick: () => void;
    color: "empty" | "yellow";
    isSelected?: boolean;
    textSize?: string;
}

export const ButtonMessage = (props: ButtonMessageProps): JSX.Element => {
    const { title, onClick, color, isSelected, textSize } = props;

    return (
        <button
            onClick={onClick}
            disabled={isSelected}
            className={`
                    font-(--font-display)
                    w-[155px] 
                    h-[25px]
                    ${color === "empty"
                    ? styles.buttonEmptyMessage
                    : styles.buttonYellow} 
                    text-(--color-black)
                    ${textSize ? textSize : 'text-base'}
                    rounded-2xl
                    cursor-pointer
                    text-left
                    pl-[9px]
                    mb-[10px]
                    `}>
            {title}
        </button>
    )
}