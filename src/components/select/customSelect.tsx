import { JSX, useEffect, useRef, useState } from "react";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const CustomSelect = ({ value, onChange, options, placeholder }: CustomSelectProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className="relative" ref={selectRef}>
            <div
                className="w-[180px] h-[30px] p-2 border-[1px] cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm">{selectedOption?.label || placeholder || 'Выберите...'}</span>
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path
                        d="M2 4L6 8L10 4"
                        stroke="#212121"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border-[1px] shadow-lg">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="p-2 cursor-pointer hover:bg-(--color-yellow-hover)"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 