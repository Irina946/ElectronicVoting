import { useEffect, useState } from "react";
import arrow from "../../assets/arrowSelect.svg"

export interface Option {
    label: string,
    value: boolean | number,
    repeat?: boolean
}

interface SelectProps {
    options: Option[],
    placeholder: string,
    value?: boolean | number;
    onChange: (value: boolean | number, repeat?: boolean) => void
}

export const Select = (props: SelectProps) => {
    const { options, onChange, placeholder, value } = props
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    useEffect(() => {
        if (value !== undefined) {
            const found = options.find(option => option.value === value);
            if (found) {
                setSelectedOption(found);
            }
        }
    }, [value, options]);

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
                    cursor-pointer
                    inline-flex
                    justify-between
                    items-center
                    rounded-[1px]
                    `}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <div className="w-[21px] h-[12px]">
                    {!isOpen ? <img src={arrow} width={21} height={12} />
                        : <img src={arrow} className="rotate-180" width={21} height={12} />}
                </div>
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