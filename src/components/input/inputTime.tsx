import React, { JSX } from "react";

interface InputTimeProps {
    initialHours?: number;
    initialMinutes?: number;
    onTimeChange: (hours: number, minutes: number) => void;
}

export const InputTime: React.FC<InputTimeProps> = ({ initialHours, initialMinutes, onTimeChange }): JSX.Element => {

    const [hours, setHours] = React.useState(initialHours ?? 14);
    const [minutes, setMinutes] = React.useState(initialMinutes ?? 0);

    React.useEffect(() => {
        if (initialHours !== undefined) {
            setHours(initialHours);
        }
        if (initialMinutes !== undefined) {
            setMinutes(initialMinutes);
        }
    }, [initialHours, initialMinutes]);

    const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 23) {
            setHours(value);
            onTimeChange(value, minutes);
        }
    }

    const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 59) {
            setMinutes(value);
            onTimeChange(hours, value);
        }
    }

    const incrementHours = () => {
        const newHours = (hours + 1) % 24;
        setHours(newHours);
        onTimeChange(newHours, minutes);
    }

    const decrementHours = () => {
        const newHours = hours === 0 ? 23 : hours - 1;
        setHours(newHours);
        onTimeChange(newHours, minutes);
    }

    const incrementMinutes = () => {
        const newMinutes = (minutes + 1) % 60;
        setMinutes(newMinutes);
        onTimeChange(hours, newMinutes);
    }

    const decrementMinutes = () => {
        const newMinutes = minutes === 0 ? 59 : minutes - 1;
        setMinutes(newMinutes);
        onTimeChange(hours, newMinutes);
    }

    return (
        <div className="flex items-center">
            <div className="relative">
                <input type="number"
                    value={hours.toString().padStart(2, '0')}
                    onChange={handleHoursChange}
                    min={0}
                    max={23}
                    className="w-[44px] 
                    h-[28px] 
                    py-[5px] 
                    pl-[7px]
                    pr-0 
                    bg-(--color-white) 
                    text-sm 
                    font-(--font-display) 
                    placeholder-(--color-placeholder) 
                    text-(--color-text)
                    p-[4px]
                    "
                />
                <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-between py-[4px] pr-[4px]">
                    <button onClick={incrementHours} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V7C14 7.55228 13.5523 8 13 8H1C0.447716 8 0 7.55228 0 7V1Z" fill="#D9D9D9" />
                            <path d="M12.8314 5.92092C13.0804 6.2341 13.0528 6.67854 12.7484 6.96256C12.4137 7.27498 11.8711 7.27498 11.5363 6.96256L7.68183 3.36507C7.29763 3.00648 6.70141 3.00648 6.3172 3.36507L2.46275 6.96256L2.36661 7.04002C2.03105 7.27239 1.55487 7.24658 1.25056 6.96256C0.915829 6.65014 0.915829 6.14361 1.25056 5.83119L6.39342 1.03119L6.48956 0.953729C6.82512 0.721355 7.30135 0.747169 7.60557 1.03119L12.7484 5.83119L12.8314 5.92092Z" fill="#212121" />
                        </svg>

                    </button>
                    <button onClick={decrementHours} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V7C14 7.55228 13.5523 8 13 8H1C0.447716 8 0 7.55228 0 7V1Z" fill="#D9D9D9" />
                            <path d="M1.16859 2.07908C0.919562 1.7659 0.947219 1.32146 1.25156 1.03744C1.58631 0.725025 2.12893 0.725025 2.46368 1.03744L6.31817 4.63493C6.70237 4.99352 7.29859 4.99352 7.6828 4.63493L11.5373 1.03744L11.6334 0.959979C11.9689 0.727606 12.4451 0.75342 12.7494 1.03744C13.0842 1.34986 13.0842 1.8564 12.7494 2.16881L7.60658 6.96881L7.51044 7.04627C7.17488 7.27864 6.69865 7.25283 6.39442 6.96881L1.25156 2.16881L1.16859 2.07908Z" fill="#333333" />
                        </svg>
                    </button>
                </div>
            </div>
            <span className="text-(--color-text) bg-(--color-white) text-sm font-(--font-display) w-[4px] h-[28px] py-[3px] px-[1px]">:</span>
            <div className="relative">
                <input type="number"
                    value={minutes.toString().padStart(2, '0')}
                    onChange={handleMinutesChange}
                    min={0}
                    max={59}
                    className="w-[44px] 
                    h-[28px] 
                    py-[5px] 
                    pl-[7px]
                    pr-0 
                    bg-(--color-white) 
                    text-sm 
                    font-(--font-display) 
                    placeholder-(--color-placeholder) 
                    text-(--color-text)
                    p-[4px]
                    "
                />
                <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-between py-[4px] pr-[4px]">
                    <button onClick={incrementMinutes} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V7C14 7.55228 13.5523 8 13 8H1C0.447716 8 0 7.55228 0 7V1Z" fill="#D9D9D9" />
                            <path d="M12.8314 5.92092C13.0804 6.2341 13.0528 6.67854 12.7484 6.96256C12.4137 7.27498 11.8711 7.27498 11.5363 6.96256L7.68183 3.36507C7.29763 3.00648 6.70141 3.00648 6.3172 3.36507L2.46275 6.96256L2.36661 7.04002C2.03105 7.27239 1.55487 7.24658 1.25056 6.96256C0.915829 6.65014 0.915829 6.14361 1.25056 5.83119L6.39342 1.03119L6.48956 0.953729C6.82512 0.721355 7.30135 0.747169 7.60557 1.03119L12.7484 5.83119L12.8314 5.92092Z" fill="#212121" />
                        </svg>

                    </button>
                    <button onClick={decrementMinutes} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V7C14 7.55228 13.5523 8 13 8H1C0.447716 8 0 7.55228 0 7V1Z" fill="#D9D9D9" />
                            <path d="M1.16859 2.07908C0.919562 1.7659 0.947219 1.32146 1.25156 1.03744C1.58631 0.725025 2.12893 0.725025 2.46368 1.03744L6.31817 4.63493C6.70237 4.99352 7.29859 4.99352 7.6828 4.63493L11.5373 1.03744L11.6334 0.959979C11.9689 0.727606 12.4451 0.75342 12.7494 1.03744C13.0842 1.34986 13.0842 1.8564 12.7494 2.16881L7.60658 6.96881L7.51044 7.04627C7.17488 7.27864 6.69865 7.25283 6.39442 6.96881L1.25156 2.16881L1.16859 2.07908Z" fill="#333333" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    );
};