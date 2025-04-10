import { JSX } from "react";
import styles from "./rowVoting.module.css";
import { IQuestionWithVote } from "../../pages/results/results";

interface RowResultProps {
    question: IQuestionWithVote,
    number: number
}

export const RowResultCandidates = (props: RowResultProps): JSX.Element => {
    const { question, number } = props

    return (
        <div>
            <div className={`
                            bg-white
                            ${styles.border}
                            `}
            >
                <div className="
                            grid
                            grid-cols-[36px_532px_133px_133px_126px]
                            ">
                    <div className="px-3.5 border-r-[0.5px] flex items-center justify-center">
                        {number}
                    </div>
                    <div className="p-3.5 border-r-[0.5px]">
                        <div className="flex flex-col gap-[7px]">
                            <div>
                                Вопрос: {question.question}
                            </div>
                            <div>
                                Решение: {question.decision}
                            </div>
                        </div>
                    </div>
                    <div className="border-r-[0.5px] flex items-center justify-center py-5">
                    </div>
                    <div className="border-r-[0.5px] flex items-center justify-center py-5">
                    </div>
                    <div className="flex items-center justify-center py-5">
                    </div>
                </div>
                {question.vote !== undefined ? 
                <div>
                    {question.vote.map((res, idx) => (
                        <div className={`
                            grid
                            grid-cols-[36px_531px_133px_133px_126px]
                            `}
                            key={res.DetailId}
                        >
                            <div className="px-3.5 border-r-[1px] flex items-center justify-center">
                            </div>
                            <div className={`py-3.5 px-12 ${styles.borderTop}`}>
                                {question.details[idx].detail_text}
                            </div>
                            <div className={`
                                            ${styles.borderTop} 
                                            border-l-[1px] 
                                            border-l-black 
                                            flex 
                                            items-center 
                                            justify-center
                                            `}>
                                {res.For?.Quantity}
                            </div>
                            <div className={`
                                            ${styles.borderTop} 
                                            py-2 
                                            px-8 
                                            border-l-[1px] 
                                            border-l-black 
                                            ${idx === 0 ? 'border-t-[1px]' : ''}
                                            flex 
                                            items-center 
                                            justify-center
                                            `}>
                                {res.Against?.Quantity}
                            </div>
                            <div className={`
                                            flex 
                                            items-center 
                                            justify-center
                                            ${styles.borderTop} 
                                            py-2 
                                            px-8 
                                            border-l-[1px] 
                                            border-l-black 
                                            ${idx === 0 ? 'border-t-[1px]' : ''}
                                            `}>
                                {res.Abstain?.Quantity}
                            </div>
                        </div>
                    ))}
                </div> : <></>}
            </div>
        </div >
    )
}