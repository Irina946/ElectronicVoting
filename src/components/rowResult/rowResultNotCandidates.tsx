import { JSX } from "react";
import { IResult } from "../informations/results";

interface RowResultProps {
    result: IResult,
    number: number
}

export const RowResultNotCandidates = (props: RowResultProps): JSX.Element => {
    const { result, number } = props

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
                key={result.id}
            >
                <div className="px-3.5 border-r-[0.5px] flex items-center justify-center">
                    {number}
                </div>
                <div className="p-3.5 border-r-[0.5px]">
                    <div className="flex flex-col gap-[7px]">
                        <div>
                            Вопрос:
                        </div>
                        <div>
                            Решение:
                        </div>
                    </div>
                </div>

                <div className="border-r-[0.5px] flex items-center justify-center py-5">
                    {result.results.map((res) => res.for)}
                </div>
                <div className="border-r-[0.5px] flex items-center justify-center py-5">
                    {result.results.map((res) => res.against)}
                </div>
                <div className="flex items-center justify-center py-5">
                    {result.results.map((res) => res.abstain)}
                </div>
            </div>
        </div >
    )
}