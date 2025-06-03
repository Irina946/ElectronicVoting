import { JSX, useEffect, useState, useCallback } from "react";
import { getMeetingAllResult } from "../../requests/requests";
import React from "react";
import { IQuestionWithVote } from "../../pages/results/results";
import { RowResultOne } from "../rowResult/rowResultOne";
import { RowResultNotCandidates } from "../rowResult/rowResultNotCandidates";
import { RowResultCandidates } from "../rowResult/rowResultCandidates";
import { convertToQuestionWithVote } from "../../utils/functions";
import { generateExcelFile } from "../../utils/excelGenerator";
import iconExport from "../../assets/get_app.svg";


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
    // status: number;
    onComplete?: () => void;
    idMeeting: number
}



export const Results = (props: ResultsProps): JSX.Element => {
    const { endTime, onComplete, idMeeting } = props
    const [resultForRow, setResultForRow] = useState<IQuestionWithVote[]>([])

    const calculateTimeLeft = useCallback(() => {
        const difference = endTime.getTime() - new Date().getTime();
        return difference > 0 ? Math.floor(difference / 1000) : 0;
    }, [endTime]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await getMeetingAllResult(idMeeting)
                setResultForRow(convertToQuestionWithVote(response))
            }
            catch (error) {
                console.log(error)
            }
        }
        if (!timeLeft) {
            fetchResults()
        }
        if (timeLeft <= 0) {
            if (onComplete) onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete, endTime, calculateTimeLeft, idMeeting]);


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
                        onClick={() => generateExcelFile(resultForRow)}
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
                                    bg-(--color-white)
                                    mb-7
                                    hover:bg-(--color-button-two)
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    `}>
                        Скачать результаты
                        <img src={iconExport} title="Скачать список собраний" className=" !w-[25px] !h-[25px]" />
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
                        {resultForRow.map((question: IQuestionWithVote, idx: number) => (

                            <React.Fragment key={question.question_id}>
                                {
                                    question.details.length === 0 && idx === 0 &&
                                    <RowResultOne question={question} number={idx + 1} key={question.question_id} />
                                }
                                {
                                    question.details.length === 0 && idx !== 0 &&
                                    <RowResultNotCandidates question={question} number={idx + 1} key={question.question_id} />
                                }
                                {
                                    question.details.length !== 0 && idx !== 0 &&
                                    <RowResultCandidates question={question} number={idx + 1} key={question.question_id} />
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