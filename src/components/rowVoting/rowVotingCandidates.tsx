import { JSX, useState } from "react";
import { Checkbox } from "../checkbox/checkbox";
import arrow from "../../assets/arrowSelect.svg";
import styles from "./rowVoting.module.css";
import { IAgenda, IDetailsForAgneda } from "../../requests/interfaces";


interface RowVotingProps {
    numberQuestion: number
    agenda: IAgenda;
    onVoteChange: (agendaNumber: number, votes: { [detaulId: number]: string }) => void;
}

export const RowVotingCandidates = (props: RowVotingProps): JSX.Element => {
    const {agenda, onVoteChange, numberQuestion} = props

    const initialVotes = Object.fromEntries(agenda.details.map(detail => [detail.detail_id, ""]));

    const [arrowRotate, setArrowRotate] = useState<{ [key: number]: boolean }>({});
    const [checkedMainCheckbox, setCheckedMainCheckbox] = useState<string>('')
    const [candidateChoice, setCandidateChoiсe] = useState<{ [detailId: number]: string }>(initialVotes)

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
            agenda.details.forEach((detail) => {
                newVotes[detail.detail_id] = type;
            });
            onVoteChange(agenda.question_id, newVotes)
            return newVotes;
        });
    }

    const allValuesAreSame = (votes: { [detailId: number]: string }): boolean => {
        const values = Object.values(votes);
        return values.length === 0 || values.every(value => value === values[0]);
    };

    const handleClickCheckbox = (detailId: number, type: string) => {
        setCandidateChoiсe((prevVotes) => {
            const updatedVotes = {
                ...prevVotes,
                [detailId]: type,
            };

            // Проверяем, одинаковы ли все значения
            if (allValuesAreSame(updatedVotes)) {
                setCheckedMainCheckbox(updatedVotes[detailId])
            } else {
                setCheckedMainCheckbox('')
            }
            onVoteChange(agenda.question_id, updatedVotes)

            return updatedVotes;
        });

    }

    return (
        <div>
            <div className={`
                            bg-white
                            ${styles.border}
                            `}
                key={agenda.question_id}
            >
                <div className="
                            grid
                            grid-cols-[36px_532px_133px_133px_126px]
                            ">
                    <div className="px-3.5 border-r-[0.5px] flex items-center justify-center">
                        {numberQuestion}
                    </div>
                    <div className="p-3.5 border-r-[0.5px]">
                        <div className="flex justify-between items-center">
                            <div className="mb-3.5 ">
                                {agenda.details.map((material) => (
                                    material.detail_text
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-[7px]">
                            <div>
                                Вопрос: {agenda.question}
                            </div>
                            <div>
                                Решение: {agenda.decision}
                            </div>
                        </div>
                        <div>
                            <button className="pt-3.5 cursor-pointer" onClick={() => toggleArrow(agenda.question_id)}>
                                <img
                                    src={arrow} alt="Стрелка для открытия"
                                    className={arrowRotate[agenda.question_id] ? 'rotate-180' : ''}
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
                    {agenda.details.map((detail: IDetailsForAgneda, idx) => (
                        <div className={`
                            ${!arrowRotate[agenda.question_id] ? 'hidden' : ''}
                            grid
                            grid-cols-[36px_531px_133px_133px_126px]
                            `}
                            key={detail.detail_id}
                        >
                            <div className="px-3.5 border-r-[1px] flex items-center justify-center">
                            </div>
                            <div className={`py-3.5 px-12 ${styles.borderTop}`}>
                                {detail.detail_text}
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
                                    checked={candidateChoice[detail.detail_id] === "ЗА"}
                                    onChange={() => handleClickCheckbox(detail.detail_id, "ЗА")}
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
                                    checked={candidateChoice[detail.detail_id] === "ПРОТИВ"}
                                    onChange={() => handleClickCheckbox(detail.detail_id, "ПРОТИВ")}
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
                                    checked={candidateChoice[detail.detail_id] === "ВОЗДЕРЖАЛСЯ"}
                                    onChange={() => handleClickCheckbox(detail.detail_id, "ВОЗДЕРЖАЛСЯ")}
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