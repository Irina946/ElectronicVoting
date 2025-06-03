import { JSX, useEffect, useRef, useState } from "react"
import calendar from "../../assets/calendar.svg"
import arrow from "../../assets/arrowCalendar.svg"
import styles from "./input.module.css"

interface InputDateProps {
    value: string;
    onChange: (value: string) => void;
}

const formatedDate = (value: string): string => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return ''; // некорректная дата

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export const CustomInputDate = (props: InputDateProps): JSX.Element => {
    const { value, onChange } = props;
    const holidays: Date[] = [
        new Date("2025-01-01"), // 1 января
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
        new Date("2026-01-01"), // 1 января
        new Date("2026-01-02"), // 2 января
        new Date("2026-01-03"), // 3 января
        new Date("2026-01-04"), // 4 января
        new Date("2026-01-05"), // 5 января
        new Date("2026-01-06"), // 6 января
        new Date("2026-01-07"), // 7 января
        new Date("2026-01-08"), // 8 января
        new Date("2026-02-23"), // 23 февраля
        new Date("2026-03-09"), // перенос с 8 марта (воскресенье)
        new Date("2026-05-01"), // 1 мая
        new Date("2026-05-11"), // перенос с 9 мая (суббота)
        new Date("2026-06-12"), // 12 июня
        new Date("2026-11-04"), // 4 ноября
        new Date("2026-12-31"), // 31 декабря
        new Date("2027-01-01"), // 1 января
        new Date("2027-01-02"), // 2 января
        new Date("2027-01-03"), // 3 января
        new Date("2027-01-04"), // 4 января
        new Date("2027-01-05"), // 5 января
        new Date("2027-01-06"), // 6 января
        new Date("2027-01-07"), // 7 января
        new Date("2027-01-08"), // 8 января
        new Date("2027-02-23"), // 23 февраля
        new Date("2027-03-08"), // 8 марта
        new Date("2027-05-03"), // перенос с 1 мая (суббота)
        new Date("2027-05-10"), // перенос с 9 мая (воскресенье)
        new Date("2027-06-14"), // перенос с 12 июня (суббота)
        new Date("2027-11-04"), // 4 ноября
        new Date("2027-12-31"), // 31 декабря
        new Date("2028-01-01"), // 1 января
        new Date("2028-01-02"), // 2 января
        new Date("2028-01-03"), // 3 января
        new Date("2028-01-04"), // 4 января
        new Date("2028-01-05"), // 5 января
        new Date("2028-01-06"), // 6 января
        new Date("2028-01-07"), // 7 января
        new Date("2028-01-08"), // 8 января
        new Date("2028-01-09"), // 9 января (перенос с субботы)
        new Date("2028-02-23"), // 23 февраля
        new Date("2028-03-08"), // 8 марта
        new Date("2028-05-01"), // 1 мая
        new Date("2028-05-09"), // 9 мая
        new Date("2028-06-12"), // 12 июня
        new Date("2028-11-06"), // перенос с 4 ноября (суббота)
        new Date("2028-12-31"), // 31 декабря
    ];

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date | null>(value ? new Date(value) : null);
    const calendarRef = useRef<HTMLDivElement | null>(null);

    const handleDateChange = (date: Date) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split('T')[0];

        onChange(dateString);
        setIsCalendarOpen(false);
    }

    const handlePreviousMonth = () => {
        if (!currentDate) return;
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    }

    const handleNextMonth = () => {
        if (!currentDate) return;
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
        if (!value) return false;
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

    useEffect(() => {
        if (value) {
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) {
                setCurrentDate(parsed);
            }
        } else {
            setCurrentDate(new Date());
        }
    }, [value]);

    const handleDateLastMonth = (date: Date) => {
        handleDateChange(date);
        handlePreviousMonth();
    }

    const handleDateNextMonth = (date: Date) => {
        handleDateChange(date);
        handleNextMonth();
    }

    const handleClear = () => {
        onChange('');
        setIsCalendarOpen(false);
    }

    const renderDays = () => {
        if (!currentDate) return [];
        
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
                    key={`prev-${date.toISOString()}`}
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
                    key={`current-${date.toISOString()}`}
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
                    key={`next-${date.toISOString()}`}
                    className="w-[28px] 
                            h-[28px] 
                            py-[7px] 
                            text-base 
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
            <div className="flex items-center">
                <input
                    type="text"
                    value={formatedDate(value)}
                    readOnly
                    onFocus={() => setIsCalendarOpen(true)}
                    className="block
                            w-[160px]
                            h-[30px]
                            p-2
                            text-sm
                            font-(--font-display)
                            text-(--color-text)
                            cursor-pointer
                            bg-(--color-white)
                            rounded-[1px]
                            border-(--color-border)
                            mr-[18px]
                            "
                    placeholder="ДД.ММ.ГГГГ"
                />
                <div className="flex items-center absolute right-1 top-1/2 -translate-y-1/2">
                    {value && (
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-(--color-yellow-hover) rounded"
                            title="Очистить дату"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={() => setIsCalendarOpen(true)}
                        className="p-1 hover:bg-(--color-yellow-hover) rounded"
                        title="Выбрать дату"
                    >
                        <img
                            src={calendar}
                            alt="Calendar"
                            className="w-4 h-4"
                        />
                    </button>
                </div>
            </div>

            {isCalendarOpen && (
                <div ref={calendarRef}
                    className="absolute 
                            bottom-full 
                            left-0 
                            z-15 
                            bg-white 
                            border-[0.5px] 
                            border-(--color-border) 
                            rounded-[16px] 
                            w-[244px]
                            mb-2
                            ">
                    <div className="flex items-center justify-between p-[14px] ">
                        <span className="text-(--color-text) text-sm font-bold capitalize">
                            {currentDate?.toLocaleString('default', { month: 'long', year: 'numeric' })}
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