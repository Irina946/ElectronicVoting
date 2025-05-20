import { JSX, useEffect, useState } from "react";
import { Checkbox } from "../checkbox/checkbox";
import arrow from "../../assets/arrowSelect.svg";
import styles from "./rowVoting.module.css";
import { InputVoting } from "../input/inputVoting";
import { IAgenda } from "../../requests/interfaces";


interface RowVotingProps {
    numberQuestion: number,
    agenda: IAgenda;
    onVoteChange: (agendaNumber: number, votes: { [candidate: string]: number } | string) => void;
    totalVotes: number;
}

export const RowVotingCandidatesCumulative = (props: RowVotingProps): JSX.Element => {
    const { agenda, totalVotes, onVoteChange, numberQuestion } = props;

    const initialVotes = Object.fromEntries(agenda.details.map(candidate => [candidate.detail_id, 0]));

    const [arrowRotate, setArrowRotate] = useState<{ [key: number]: boolean }>({});
    const [selectedVote, setSelectedVote] = useState<string | null>(null);
    const [candidateVotes, setCandidateVotes] = useState<{ [candidate: string]: number }>(initialVotes);
    const [newTotalVotes, setNewTotalVotes] = useState(totalVotes);


    useEffect(() => {
        if (selectedVote === "ЗА") {
            onVoteChange(agenda.question_id, candidateVotes)
        }
    }, [candidateVotes])

    // Обновление голосов при изменении состояния
    const handleClickYes = () => {
        if (selectedVote === "ЗА") return;  // предотвращаем бесконечный ререндер, если уже выбран "ЗА"

        const totalVotesNew = totalVotes / agenda.details.length;
        const newVotes = Object.fromEntries(
            agenda.details.map(candidate => [candidate.detail_id, totalVotesNew])
        );

        setCandidateVotes(newVotes);
        setNewTotalVotes(0);
        setSelectedVote('ЗА');
        onVoteChange(agenda.question_id, candidateVotes)
    };

    const handleClickNo = (type: string) => {
        if (selectedVote === type) return; // предотвращаем перерисовку, если уже выбрано нужное значение

        setCandidateVotes((prevVotes) => {
            const newVotes = { ...prevVotes };
            agenda.details.forEach((candidate) => {
                newVotes[candidate.detail_id] = 0;
            });
            return newVotes;
        });
        setNewTotalVotes(totalVotes);
        setSelectedVote(type);
        onVoteChange(agenda.question_id, type)
    };

    const onChangeInput = (candidate: number, value: number) => {
        setCandidateVotes((prevVotes) => {
            const newVotes = { ...prevVotes, [candidate]: value }
            return newVotes
        })
        const sumVotes = Object.values(candidateVotes).reduce((acc, val) => acc + val, 0) + value
        setNewTotalVotes(Math.max(totalVotes - sumVotes, 0))
        if (selectedVote !== 'ЗА') setSelectedVote("ЗА");
    };

    const toggleArrow = (id: number) => {
        setArrowRotate((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div>
            <div className={`${styles.border} bg-white`} key={agenda.question_id}>
                <div className="grid grid-cols-[36px_532px_133px_133px_126px]">
                    <div className="px-3.5 border-r-[0.5px] flex items-center justify-center">{numberQuestion}</div>
                    <div className="p-3.5 border-r-[0.5px]">
                        <div className="flex justify-between items-center">
                            {/* <div className="mb-3.5 ">{agenda.materials.map((material) => material.name)}</div> */}
                            <div className="w-[280px] flex gap-3.5 items-center">
                                <div>Количество кумулятивных голосов:</div>
                                <div className="border-[0.5px] border-black bg-(--color-gray) w-[40px] py-[5px] text-center">
                                    {newTotalVotes}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[7px]">
                            <div>Вопрос: {agenda.question}</div>
                            <div>Решение: {agenda.decision}</div>
                        </div>
                        <div>
                            <button className="pt-3.5 cursor-pointer" onClick={() => toggleArrow(agenda.question_id)}>
                                <img
                                    src={arrow}
                                    alt="Стрелка для открытия"
                                    className={arrowRotate[agenda.question_id] ? 'rotate-180' : ''}
                                    width={21}
                                    height={12}
                                />
                            </button>
                        </div>
                    </div>
                    <div className="border-r-[0.5px] flex items-center justify-center py-5">
                        <Checkbox
                            checked={selectedVote === "ЗА"}
                            onChange={handleClickYes}
                            voting={true}
                        />
                    </div>
                    <div className="border-r-[0.5px] flex items-center justify-center py-5">
                        <Checkbox
                            checked={selectedVote === "ПРОТИВ"}
                            onChange={() => handleClickNo("ПРОТИВ")}
                            voting={true}
                        />
                    </div>
                    <div className="flex items-center justify-center py-5">
                        <Checkbox
                            checked={selectedVote === "ВОЗДЕРЖАЛСЯ"}
                            onChange={() => handleClickNo("ВОЗДЕРЖАЛСЯ")}
                            voting={true}
                        />
                    </div>
                </div>

                <div>
                    {agenda.details.map((candidate, idx) => (
                        <div key={candidate.detail_id} className={`${!arrowRotate[agenda.question_id] ? 'hidden' : ''} grid grid-cols-[36px_531px_133px_133px_126px]`}>
                            <div className="px-3.5 border-r-[1px] flex items-center justify-center"></div>
                            <div className={`py-3.5 px-12 ${styles.borderTop}`}>{candidate.detail_text}</div>
                            <div className={`${styles.borderTop} border-l-[1px] border-l-black py-2 px-8`}>
                                <InputVoting
                                    value={candidateVotes[candidate.detail_id]} // обновляем значение из состояния
                                    onChange={(newValue) => onChangeInput(candidate.detail_id, newValue)}
                                    totalValue={newTotalVotes}
                                />
                            </div>
                            <div className={`border-l-[1px] border-l-black ${idx === 0 ? 'border-t-[1px]' : ''}`}></div>
                            <div className={`border-l-[1px] border-l-black ${idx === 0 ? 'border-t-[1px]' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
