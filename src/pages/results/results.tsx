import { useEffect, useState } from "react";
import { IAgenda, IResultsMeeting, IVoteInstr } from "../../requests/interfaces";
import { getMeetingResults } from "../../requests/requests";
import { useLocation, useNavigate } from "react-router";
import React from "react";
import { RowResultOne } from "../../components/rowResult/rowResultOne";
import { RowResultNotCandidates } from "../../components/rowResult/rowResultNotCandidates";
import { RowResultCandidates } from "../../components/rowResult/rowResultCandidates";
import { Button } from "../../components/button/button";
import { mergeQuestionsWithVotes } from "../../utils/functions";
import { AxiosError } from 'axios';

export interface IQuestionWithVote extends IAgenda {
    vote?: IVoteInstr[]; // vote теперь массив, так как может быть несколько голосов
}


export const Results = () => {
    const [results, setResults] = useState<IResultsMeeting | null | undefined>()
    const [error, setError] = useState<string>()
    const location = useLocation();
    const navigate = useNavigate();
    const meetingInfo: { id: number, userId: number, userName: string } = location.state
    const [resultForRow, setResultForRow] = useState<IQuestionWithVote[]>([])

    useEffect(() => {
        const getMeeting = async () => {
            try {
                const data = await getMeetingResults(meetingInfo.id, meetingInfo.userId)
                setResults(data);
                setResultForRow(mergeQuestionsWithVotes(data.data, data.votes))
            } catch (error: unknown) {
                if (error instanceof AxiosError && error.response?.status === 404) {
                    setError("Пользователь не проголосовал")
                    setResults(null)
                } else {
                    console.error("Error fetching message:", error);
                    setResults(null)
                }
            }
        };
        getMeeting()
    }, [meetingInfo]);

    return (
        <>
            {results === undefined ? (
                <div className="flex justify-center items-center m-auto h-[190px]">
                    <div className="loader"></div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center m-auto h-[190px]">
                    <div className="text-red-500 text-xl">{error}</div>
                </div>
            ) : results === null ? (
                <div className="flex justify-center items-center m-auto h-[190px]">
                    <div className="text-red-500 text-xl">Произошла ошибка при загрузке данных</div>
                </div>
            ) : (
                <div className="w-[1016px] m-auto">
                    <h1 className="text-[32px] text-(--color-text) my-7">
                        Результаты голосования акционера {meetingInfo.userName}
                    </h1>
                    <Button title="Назад" color="empty" onClick={() => navigate(-1)} />
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
                                mt-7
                                ">
                        
                        {/* <a className="text-(--color-red) underline font-bold mb-7">
                            Материалы собрания
                        </a> */}
                        {resultForRow.map((question: IQuestionWithVote, idx: number) => (
                            <React.Fragment key={question.question_id}>
                                {question.details.length === 0 && idx === 0 && (
                                    <RowResultOne question={question} number={idx + 1} key={question.question_id} />
                                )}
                                {question.details.length === 0 && idx !== 0 && (
                                    <RowResultNotCandidates question={question} number={idx + 1} key={question.question_id} />
                                )}
                                {question.details.length !== 0 && idx !== 0 && (
                                    <RowResultCandidates question={question} number={idx + 1} key={question.question_id} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}