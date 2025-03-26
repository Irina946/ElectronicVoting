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

    const [valueInput, setValueInput] = useState(value);
    const [errorState, setErrorState] = useState(error || '');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValueInput(newValue);
        onChange(newValue);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        if (type === 'text') {
            // Проверка формата номера телефона
            const phoneRegex = /^\+7\d{10}$/;
            if (!phoneRegex.test(newValue)) {
                setErrorState('Номер телефона должен быть в формате +79999999999');
            } else {
                setErrorState('');
            }
        }
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
                ${errorState ? 'border-red-500' : ''}`}
            required
            onBlur={handleBlur}
        />
        {errorState && <p className="text-red-600 text-sm -mt-15 mb-1">{errorState}</p>}
    </label>
};
