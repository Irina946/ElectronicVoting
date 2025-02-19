import { JSX, useEffect, useRef, useState } from "react"
import calendar from "../../assets/calendar.svg"
import arrow from "../../assets/arrowCalendar.svg"
import styles from "./input.module.css"

interface InputDateProps {
    value: string;
    onChange: (value: string) => void;
}

const formatedDate = (date: string): string => {
    const arrayDate = date.split('-');
    return `${arrayDate[2]}.${arrayDate[1]}.${arrayDate[0]}`
}

export const InputDate = (props: InputDateProps): JSX.Element => {
    const { value, onChange } = props;
    const holidays: Date[] = [
        new Date("2025-01-01"), // 1 января
        new Date("2025-01-02"), // 2 января
        new Date("2025-01-03"), // 3 января
        new Date("2025-01-04"), // 4 января
        new Date("2025-01-05"), // 5 января
        new Date("2025-01-06"), // 6 января
        new Date("2025-01-07"), // 7 января
        new Date("2025-01-08"), // 8 января
        new Date("2025-05-01"), // 1 мая
        new Date("2025-05-02"), // 2 мая
        new Date("2025-05-08"), // 8 мая
        new Date("2025-05-09"), // 9 мая
        new Date("2025-06-12"), // 12 июня
        new Date("2025-06-13"), // 13 июня
        new Date("2025-11-02"), // 2 ноября
        new Date("2025-11-03"), // 3 ноября
        new Date("2025-11-04"), // 4 ноября
        new Date("2025-12-31"), // 31 декабря
    ];;

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement | null>(null);

    const handleDateChange = (date: Date) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split('T')[0];

        onChange(dateString);
        setIsCalendarOpen(false);
    }

    const handlePreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    }

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    }

    const isHoliday = (date: Date): boolean => {
        return holidays.some(holiday => holiday.toDateString() === date.toDateString());
    }

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelectedDate = (date: Date): boolean => {
        const selected = new Date(value);
        return date.toDateString() === selected.toDateString();
    };

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number): number => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const getLastDayOfPreviousMonth = (year: number, month: number): number => {
        return new Date(year, month, 0).getDate();
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDateLastMonth = (date: Date) => {
        handleDateChange(date);
        handlePreviousMonth();
    }

    const handleDateNextMonth = (date: Date) => {
        handleDateChange(date);
        handleNextMonth();
    }

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const lastDayOfPreviousMonth = getLastDayOfPreviousMonth(year, month);

        const days = [];
        const previosMonthDay = lastDayOfPreviousMonth - firstDayOfMonth + 1;

        for (let i = 0; i < firstDayOfMonth; i++) {
            const date = new Date(year, month - 1, previosMonthDay + i);
            days.push(
                <div
                    key={date.toDateString()}
                    className="w-[28px] 
                            h-[28px] 
                            py-[7px] 
                            text-center 
                            text-[14px] 
                            leading-[14px] 
                            text-(--color-calendar-prew) 
                            cursor-pointer
                            hover:bg-yellow-100
                            "
                    onClick={() => handleDateLastMonth(date)}
                >
                    {previosMonthDay + i}
                </div>
            )
        }

        for (let i = 0; i < daysInMonth; i++) {
            const date = new Date(year, month, i + 1);
            days.push(
                <div
                    key={date.toDateString()}
                    className={`w-[28px] h-[28px] py-[7px] text-center text-[14px] leading-[14px] cursor-pointer ${isToday(date) ? 'bg-(--color-yellow-hover)' : ''
                        } hover:bg-yellow-100 ${isSelectedDate(date) ? styles.selectedDate : ''
                        } ${isHoliday(date) ? 'border-[0.5px] border-(--color-border)' : ''
                        }`}
                    onClick={() => handleDateChange(date)}
                >
                    {i + 1}
                </div>
            )
        }
        const totalDays = days.length;
        const remainingDays = 42 - totalDays;
        for (let i = 0; i < remainingDays; i++) {
            const date = new Date(year, month + 1, i + 1);
            days.push(
                <div
                    key={date.toDateString()}
                    className="w-[28px] 
                            h-[28px] 
                            py-[7px] 
                            text-center 
                            text-[14px] 
                            leading-[14px] 
                            text-(--color-calendar-prew) 
                            cursor-pointer
                            hover:bg-(--color-yellow-hover)
                            "
                    onClick={() => handleDateNextMonth(date)}
                >
                    {i + 1}
                </div>
            );
        }

        return days;
    }



    return (
        <div className="relative">
            <input
                type="text"
                value={formatedDate(value)}
                readOnly
                onFocus={() => setIsCalendarOpen(true)}
                className="block
                        w-[128px]
                        h-[28px]
                        px-[7px]
                        py-[5px]
                        text-sm
                        font-(--font-display)
                        text-(--color-text)
                        cursor-pointer
                        bg-(--color-white)
                        rounded-[1px]
                        "
                placeholder="ДД.ММ.ГГГГ"

            />
            <img
                src={calendar}
                alt="Calendar"
                className="absolute left-[103px] top-[5px] cursor-pointer"
                onClick={() => setIsCalendarOpen(true)} />
            {isCalendarOpen && (
                <div ref={calendarRef}
                    className="absolute 
                            bottom-full 
                            left-[100px] 
                            z-15 
                            bg-white 
                            border-[0.5px] 
                            border-(--color-border) 
                            rounded-[16px] 
                            w-[244px]
                            ">
                    <div className="flex items-center justify-between p-[14px] ">
                        <span className="text-(--color-text) text-sm font-bold capitalize">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <div>
                            <button onClick={handlePreviousMonth} className="cursor-pointer mr-[11px] hover:bg-(--color-yellow-hover)">
                                <img src={arrow} alt="Arrow" />
                            </button>

                            <button onClick={handleNextMonth} className="cursor-pointer hover:bg-(--color-yellow-hover)">
                                <img src={arrow} alt="Arrow" className="rotate-180" />
                            </button>
                        </div>

                    </div>
                    <div className="grid grid-cols-7 gap-[3px] p-[14px] pt-0">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                            <div key={day} className="text-black text-center text-[10px]">
                                {day}
                            </div>
                        ))}
                        {renderDays()}

                    </div>
                </div>
            )}
        </div>


    )
}