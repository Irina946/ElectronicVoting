import { useState } from "react";

interface InputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void
}

export const Input = (props: InputProps) => {
    const { placeholder, value, onChange } = props

    const [valueInput, setValueInput] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValueInput(newValue);
        onChange(newValue);
    }

    return <input
        type="text"
        placeholder={placeholder}
        value={valueInput}
        onChange={handleChange}
        className="w-[100%] 
                h-7
                py-[5px]
                px-[10px]
                bg-(--color-white) 
                text-sm 
                font-(--font-display) 
                placeholder-(--color-placeholder) 
                text-(--color-text)"
    />;
};