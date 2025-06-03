import { JSX, useState } from "react";

interface InputProps {
    value: string;
    type: 'text' | 'password';
    onChange: (value: string) => void;
    label: string;
    error?: string;
    fieldType?: 'login' | 'password';
    placeholder?: string
}


export const InputAuthorization = (props: InputProps): JSX.Element => {
    const { value, onChange, type, label, error, fieldType, placeholder } = props

    const [valueInput, setValueInput] = useState(value)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;

        if (fieldType === 'login') {
            // Очищаем номер телефона от всех символов, кроме цифр
            newValue = newValue.replace(/\D/g, '');

            // Убираем существующий префикс +7, если он есть
            if (newValue.startsWith('+7')) {
                newValue = newValue.slice(2); // Удаляем +7
            } else if (newValue.startsWith('7')) {
                newValue = newValue.slice(1); // Удаляем 7
            }

            // Если номер начинается с 8, заменяем на +7
            if (newValue.startsWith('8')) {
                newValue = '+7' + newValue.slice(1);
            } 
            // Если номер не начинается с +7 и не пустой, добавляем +7
            else if (newValue.length > 0) {
                newValue = '+7' + newValue;
            }

            if (newValue.length > 12) {
                newValue = newValue.slice(0, 12);
            }
        }

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
            placeholder={placeholder || ''}
        />
        {error && <p className="text-red-600 text-sm -mt-15 mb-1">{error}</p>}
    </label>
};
