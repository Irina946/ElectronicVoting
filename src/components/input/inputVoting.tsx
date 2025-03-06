import { JSX, useEffect, useState } from "react";

interface InputProps {
    value: number;
    onChange: (value: number) => void;
    totalValue: number
}

export const InputVoting = (props: InputProps): JSX.Element => {
    const { value, onChange, totalValue } = props

    const [valueInput, setValueInput] = useState(value);
    const [error, setError] = useState(false)

    const [stylesError, setStylesError] = useState('')

    useEffect(() => {
        setValueInput(value);
    }, [value])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onChange(valueInput);
        }
    };

    const handleBlur = () => {
        onChange(valueInput);
        setStylesError('')
        setError(false)
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value)
        if (totalValue - newValue >= 0) {
            setValueInput(newValue);
            setStylesError('')
            setError(false)
        } else {
            setValueInput(totalValue)
            setStylesError('outline-[#C33F36] outline-[3px]')
            setError(true)
        }
    };

    return (
        <>
            <input
                type="text"
                value={valueInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className={`w-[69px] 
                h-7
                py-[5px]
                px-[10px]
                text-center
                bg-(--color-gray) 
                text-sm 
                font-(--font-display) 
                text-(--color-text)
                border-[1px]
                border-black
                ${stylesError}
                `}
            />
            {error
                && <div className="absolute border-[1px] border-black w-[100px] bg-white text-center ml-[-15px]">
                    Превышено количество возможных голосов
                </div>}
        </>
    )
};