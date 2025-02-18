import { JSX } from "react"
import styles from "./button.module.css"

interface ButtonProps {
    title: string;
    onClick: () => void
    color: "empty" | "yellow"
}

export const Button = (props: ButtonProps): JSX.Element => {
    const { title, onClick, color } = props;

    return (
        <button
            onClick={onClick}
            className={`
                    font-(--font-display)
                    w-[215px] 
                    h-[45px]
                    ${color === "empty"
                    ? styles.buttonEmpty
                    : styles.buttonYellow} 
                    text-(--color-black)
                    text-sm
                    font-bold
                    rounded-2xl
                    shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
                    cursor-pointer
                    `}>
            {title}
        </button>
    )
}