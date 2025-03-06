import { JSX, useState } from "react";
import { IAgenda } from "../row/row";
import { Checkbox } from "../checkbox/checkbox";
import arrow from "../../assets/arrowSelect.svg";
import styles from "./rowVoting.module.css";

interface RowVotingProps {
    agenda: IAgenda;
    onVoteChange: (agendaNumber: number, votes: { [candidate: string]: string }) => void;
}

export const RowVotingCandidates = (props: RowVotingProps): JSX.Element => {
    const {agenda, onVoteChange} = props

    const initialVotes = Object.fromEntries(agenda.candidates.map(candidate => [candidate, ""]));

    const [arrowRotate, setArrowRotate] = useState<{ [key: number]: boolean }>({});
    const [checkedMainCheckbox, setCheckedMainCheckbox] = useState<string>('')
    const [candidateChoice, setCandidateChoiсe] = useState<{ [candidate: string]: string }>(initialVotes)

    const toggleArrow = (id: number) => {
        setArrowRotate(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const handelClickMainCheckbox = (type: string) => {
        setCheckedMainCheckbox(type)
        setCandidateChoiсe((prevVotes) => {
            const newVotes = { ...prevVotes };
            agenda.candidates.forEach((candidate) => {
                newVotes[candidate] = type;
            });
            onVoteChange(agenda.number, newVotes)
            return newVotes;
        });
    }

    const allValuesAreSame = (votes: { [candidate: string]: string }): boolean => {
        const values = Object.values(votes);
        return values.length === 0 || values.every(value => value === values[0]);
    };

    const handleClickCheckbox = (candidate: string, type: string) => {
        setCandidateChoiсe((prevVotes) => {
            const updatedVotes = {
                ...prevVotes,
                [candidate]: type,
            };

            // Проверяем, одинаковы ли все значения
            if (allValuesAreSame(updatedVotes)) {
                setCheckedMainCheckbox(updatedVotes[candidate])
            } else {
                setCheckedMainCheckbox('')
            }
            onVoteChange(agenda.number, updatedVotes)

            return updatedVotes;
        });

    }

    return (
        <div>
            <div className={`
                            bg-white
                            ${styles.border}
                            `}
                key={agenda.number}
            >
                <div className="
                            grid
                            grid-cols-[36px_532px_133px_133px_126px]
                            ">
                    <div className="px-3.5 border-r-[0.5px] flex items-center justify-center">
                        {agenda.number}
                    </div>
                    <div className="p-3.5 border-r-[0.5px]">
                        <div className="flex justify-between items-center">
                            <div className="mb-3.5 ">
                                {agenda.materials.map((material) => (
                                    material.name
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-[7px]">
                            <div>
                                Вопрос: {agenda.question}
                            </div>
                            <div>
                                Решение: {agenda.solution}
                            </div>
                        </div>
                        <div>
                            <button className="pt-3.5 cursor-pointer" onClick={() => toggleArrow(agenda.number)}>
                                <img
                                    src={arrow} alt="Стрелка для открытия"
                                    className={arrowRotate[agenda.number] ? 'rotate-180' : ''}
                                />
                            </button>
                        </div>
                    </div>
                    <div className="border-r-[0.5px] flex items-center justify-center py-5">
                        <Checkbox
                            checked={checkedMainCheckbox === "ЗА"}
                            onChange={() => handelClickMainCheckbox("ЗА")}
                            voting={true}
                        />
                    </div>
                    <div className="border-r-[0.5px] flex items-center justify-center py-5">
                        <Checkbox
                            checked={checkedMainCheckbox === "ПРОТИВ"}
                            onChange={() => handelClickMainCheckbox("ПРОТИВ")}
                            voting={true}
                        />
                    </div>
                    <div className="flex items-center justify-center py-5">
                        <Checkbox
                            checked={checkedMainCheckbox === "ВОЗДЕРЖАЛСЯ"}
                            onChange={() => handelClickMainCheckbox("ВОЗДЕРЖАЛСЯ")}
                            voting={true}
                        />
                    </div>
                </div>
                <div>
                    {agenda.candidates.map((candidate, idx) => (
                        <div className={`
                            ${!arrowRotate[agenda.number] ? 'hidden' : ''}
                            grid
                            grid-cols-[36px_531px_133px_133px_126px]
                            `}
                            key={idx}
                        >
                            <div className="px-3.5 border-r-[1px] flex items-center justify-center">
                            </div>
                            <div className={`py-3.5 px-12 ${styles.borderTop}`}>
                                {candidate}
                            </div>
                            <div className={`
                                            ${styles.borderTop} 
                                            border-l-[1px] 
                                            border-l-black 
                                            flex 
                                            items-center 
                                            justify-center
                                            `}>
                                <Checkbox
                                    checked={candidateChoice[candidate] === "ЗА"}
                                    onChange={() => handleClickCheckbox(candidate, "ЗА")}
                                    voting={true}
                                />
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
                                <Checkbox
                                    checked={candidateChoice[candidate] === "ПРОТИВ"}
                                    onChange={() => handleClickCheckbox(candidate, "ПРОТИВ")}
                                    voting={true}
                                />
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
                                <Checkbox
                                    checked={candidateChoice[candidate] === "ВОЗДЕРЖАЛСЯ"}
                                    onChange={() => handleClickCheckbox(candidate, "ВОЗДЕРЖАЛСЯ")}
                                    voting={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}