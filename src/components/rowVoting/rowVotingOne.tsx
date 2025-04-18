import { JSX, useState } from "react";
import { Checkbox } from "../checkbox/checkbox";
import { IAgenda } from "../../requests/interfaces";

interface RowVotingProps {
    numberQuestion: number,
    agenda: IAgenda,
    onVoteChange: (agendaNumber: number, vote: string) => void;
}

export const RowVotingOne = (props: RowVotingProps): JSX.Element => {
    const {agenda, onVoteChange, numberQuestion} = props

    const [selectedVote, setSelectedVote] = useState<string | null>(null);

    const handleVoteChange = (vote: string) => {
        setSelectedVote(vote);
        onVoteChange(agenda.question_id, vote)
    }

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
                key={agenda.question_id}
            >
                <div className="px-3.5 border-r-[0.5px] flex items-center justify-center">
                    {numberQuestion}
                </div>
                <div className="p-3.5 border-r-[0.5px]">
                    <div className="mb-3.5 ">
                        {/* {agenda.materials.map((material) => (
                            material.name
                        ))} */}
                    </div>
                    <div className="flex flex-col gap-[7px]">
                        <div>
                            Вопрос: {agenda.question}
                        </div>
                        <div>
                            Решение: {agenda.decision}
                        </div>
                    </div>
                </div>
                <div className="border-r-[0.5px]">
                    <div className="border-b-[0.5px] font-bold text-center py-2">
                        ЗА
                    </div>
                    <div className="flex items-center justify-center py-5">
                        <Checkbox
                            checked={selectedVote === "ЗА"}
                            onChange={() => handleVoteChange("ЗА")}
                            voting={true}
                        />
                    </div>
                </div>
                <div className="border-r-[0.5px]">
                    <div className="border-b-[0.5px] font-bold text-center py-2">
                        ПРОТИВ
                    </div>
                    <div className="flex items-center justify-center py-5">
                        <Checkbox
                            checked={selectedVote === "ПРОТИВ"}
                            onChange={() => handleVoteChange("ПРОТИВ")}
                            voting={true}
                        />
                    </div>
                </div>
                <div>
                    <div className="border-b-[0.5px] font-bold text-center py-2">
                        ВОЗДЕРЖАЛСЯ
                    </div>
                    <div className="flex items-center justify-center py-5">
                        <Checkbox
                            checked={selectedVote === "ВОЗДЕРЖАЛСЯ"}
                            onChange={() => handleVoteChange("ВОЗДЕРЖАЛСЯ")}
                            voting={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}