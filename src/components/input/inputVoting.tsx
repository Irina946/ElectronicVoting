import { JSX, useState } from "react";

interface InputProps {
    value: string;
    onChange: (value: string) => void
}

export const InputVoting = (props: InputProps): JSX.Element => {
    const { value, onChange } = props

    const [valueInput, setValueInput] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValueInput(newValue);
        onChange(newValue);
    }

    return <input
        type="text"
        value={valueInput}
        onChange={handleChange}
        className="w-[69px] 
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
                "
    />;
};