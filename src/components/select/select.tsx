import { useState } from "react";
import arrow from "../../assets/arrowSelect.svg"

export interface Option {
    label: string,
    value: boolean | string,
    repeat?: boolean
}

interface SelectProps {
    options: Option[],
    placeholder: string,
    onChange: (value: boolean | string, repeat?: boolean) => void
}

export const Select = (props: SelectProps) => {
    const { options, onChange, placeholder } = props
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        onChange(option.value, option.repeat)
        setIsOpen(false);
    };

    return (
        <div>
            <button
                onClick={handleToggle}
                className={`w-[100%] 
                    h-[28px] 
                    py-auto 
                    px-[10px] 
                    bg-(--color-white) 
                    text-sm 
                    font-(--font-display) 
                    placeholder-(--color-placeholder)
                    ${selectedOption ? 'text-(--color-text)' : 'text-(--color-placeholder)'} 
                    
                    inline-flex
                    justify-between
                    items-center
                    rounded-[1px]
                    `}
            >
                {selectedOption ? selectedOption.label : placeholder}
                {!isOpen ? <img src={arrow} /> : <img src={arrow} className="rotate-180" />}
            </button>
            {isOpen && (
                <ul className="z-10 absolute w-[424px]">
                    {options.map((option) => (
                        <li
                            key={option.label}
                            onClick={() => handleSelect(option)}
                            className="w-[100%]
                                    h-[28px]
                                    pt-[3px]
                                    px-[10px]
                                    bg-(--color-white)
                                    text-sm
                                    font-(--font-display)
                                    text-(--color-text)
                                    border-[0.5px]
                                    border-(--color-border)
                                    cursor-pointer
                                    align-middle
                                    mb-[-1px]
                                    hover:bg-(--color-yellow-hover)
                            "
                            >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};