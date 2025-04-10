import { JSX } from "react"

interface ButtonAccountsProps {
    fullName: string;
    onClick: () => void;
}

export const ButtonAccounts: React.FC<ButtonAccountsProps> = ({ fullName, onClick }): JSX.Element => {
    return (
        <button className="
            cursor-pointer
            py-0.5
            px-2
            border-[1px]
            border-white
            hover:border-(--color-button)
            focus:border-black
            active:border-(--color-button-two)
            transition 
            ease-in-out 
            duration-150
            w-[250px]
            text-left
        "
        onClick={onClick}
        >
            {fullName}
        </button>
    )
}