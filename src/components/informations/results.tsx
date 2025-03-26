import { JSX, useEffect, useState, useCallback } from "react";
import { RowResultOne } from "../rowResult/rowResultOne";
import { RowResultNotCandidates } from "../rowResult/rowResultNotCandidates";
import { RowResultCandidates } from "../rowResult/rowResultCandidates";
import React from "react";

interface IResultChecked {
    detailId: number | null;
    for: number | null;
    against: number | null;
    abstain: number | null;
}

export interface IResult {
    id: number;
    results: IResultChecked[];
}


interface ResultsProps {
    endTime: Date;
    onComplete?: () => void;
    results: IResult[]
}



export const Results = (props: ResultsProps): JSX.Element => {
    const { endTime, onComplete, results } = props



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
            {!timeLeft
                ?
                <>
                    <button
                        className={`
                                    w-[215px] 
                                    h-[45px]
                                    text-(--color-black)
                                    rounded-2xl
                                    shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
                                    cursor-pointer
                                    border-[1px]
                                    font-bold
                                    text-base
                                    border-(--color-border)
                                    bg-(--color-button)
                                    mb-7
                                    `}>
                        Скачать результаты
                    </button>
                    <div className="
                                            w-full
                                            py-3.5
                                            px-7
                                            bg-gray
                                            outline-[0.5px]
                                            outline-black
                                            rounded-2xl
                                            text-sm
                                            text-(--color-text)
                                            ">
                        {results.map((result: IResult, idx: number) => (
                            <React.Fragment key={result.id}>
                                {
                                    result.results.length === 1 && idx === 0 &&
                                    <RowResultOne result={result} number={idx + 1} key={result.id} />
                                }
                                {
                                    result.results.length === 1 && idx !== 0 &&
                                    <RowResultNotCandidates result={result} number={idx + 1} key={result.id} />
                                }
                                {
                                    result.results.length !== 1 && idx !== 0 &&
                                    <RowResultCandidates result={result} number={idx + 1} key={result.id} />
                                }
                            </React.Fragment>
                        ))}
                    </div>
                </>
                : <>
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
                </>
            }
        </div>

    )
}