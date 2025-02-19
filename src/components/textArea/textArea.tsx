import { JSX, useState } from "react";

interface ITextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string
}

export const TextArea = (props: ITextAreaProps): JSX.Element => {
    const { label, value, onChange, placeholder } = props

    const [valueInput, setValueInput] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setValueInput(newValue);
        onChange(newValue);
    }

    return (
        <label >
            {label}
            <textarea
                value={valueInput}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-[755px] 
                        h-[77px] 
                        py-[5px] 
                        px-[7px] 
                        bg-(--color-white) 
                        text-sm 
                        font-(--font-display) 
                        placeholder-(--color-placeholder) 
                        text-(--color-text)
                        mt-[7px]
                        resize-none
                        "
            />
        </label>
    )
}