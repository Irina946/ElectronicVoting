import { JSX } from "react";
import { IQuestionWithVote } from "../../pages/results/results";

interface RowResultProps {
    question: IQuestionWithVote,
    number: number
}

export const RowResultOne = (props: RowResultProps): JSX.Element => {
    const { question, number } = props

    return (
        <div>
            <div className="
                            bg-white
                            border-[0.5px]
                            border-(--color-black)
                            grid
                            grid-cols-[36px_532px_133px_133px_126px]
                            mb-[-1px]
                            "
            >
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
                <div className="border-r-[0.5px]">
                    <div className="border-b-[0.5px] font-bold text-center py-2">
                        ЗА
                    </div>
                    <div className="flex items-center justify-center py-5">
                        {question.vote !== undefined ? question.vote.map((res) => res.For?.Quantity) : '0'}
                    </div>
                </div>
                <div className="border-r-[0.5px]">
                    <div className="border-b-[0.5px] font-bold text-center py-2">
                        ПРОТИВ
                    </div>
                    <div className="flex items-center justify-center py-5">
                        {question.vote !== undefined ? question.vote.map((res) => res.Against?.Quantity) : '0'}
                    </div>
                </div>
                <div>
                    <div className="border-b-[0.5px] font-bold text-center py-2">
                        ВОЗДЕРЖАЛСЯ
                    </div>
                    <div className="flex items-center justify-center py-5">
                        {question.vote !== undefined ? question.vote.map((res) => res.Abstain?.Quantity) : '0'}
                    </div>
                </div>
            </div>
        </div>
    )
}