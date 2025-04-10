import { JSX, useState } from "react";

interface InputProps {
    value: string;
    type: 'text' | 'password';
    onChange: (value: string) => void;
    label: string;
    error?: string;

}

export const InputAuthorization = (props: InputProps): JSX.Element => {
    const { value, onChange, type, label, error } = props

    const [valueInput, setValueInput] = useState(value)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        // if (type === 'text' && !newValue.startsWith('+7')) {
        //     newValue = '+7' + newValue.replace('+7', '');
        // }

        setValueInput(newValue);
        onChange(newValue);
    };

    return <label className="w-[90%] flex flex-col gap-9 text-base font-medium text-black">
        {label}
        <input
            type={type}
            value={valueInput}
            onChange={handleChange}
            className={`w-[90%] 
                h-[45px]
                text-[100%]
                border-[.2vw]
                border-[#CCCCCC]
                rounded-[.5vw]
                py-[0.5vw]
                px-[1vw]
                mb-9
                ${error ? 'border-red-500' : ''}`}
            required
        />
        {error && <p className="text-red-600 text-sm -mt-15 mb-1">{error}</p>}
    </label>
};
