import { JSX, useEffect, useState, useCallback } from "react";

interface ResultsProps {
    endTime: Date;
    onComplete?: () => void;
}

export const Results = (props: ResultsProps): JSX.Element => {
    const { endTime, onComplete } = props

    const calculateTimeLeft = useCallback(() => {
        const difference = endTime.getTime() - new Date().getTime();
        return difference > 0 ? Math.floor(difference / 1000) : 0;
    }, [endTime]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onComplete) onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete, endTime, calculateTimeLeft]);

    const formatTime = (time: number) => {
        const days = Math.floor(time / (3600 * 24));
        const hours = Math.floor((time % (3600 * 24)) / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${days}д ${String(hours)}ч ${String(minutes)}м ${String(seconds)}с`;
    };
    return (
        <div className="
                        text-[32px] text-(--color-text)
        ">
            <div>
                Результаты будут после окончания голосования: {String(
                    endTime.getDate())
                    .padStart(2, "0")}.{String(
                        endTime.getMonth())
                        .padStart(2, "0")}.{endTime
                            .getFullYear()} {String(
                                endTime.getHours()).
                                padStart(2, "0")}:{String(
                                    endTime.getMinutes())
                                    .padStart(2, "0")}:{String(
                                        endTime.getSeconds())
                                        .padStart(2, "0")}
            </div>
            <div>
                До окончания осталось: {formatTime(timeLeft)}
            </div>

        </div>
    )
}