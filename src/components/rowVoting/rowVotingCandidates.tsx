import { JSX, useState } from "react";
import { IAgenda } from "../row/row";
import { Checkbox } from "../checkbox/checkbox";
import arrow from "../../assets/arrowSelect.svg";
import styles from "./rowVoting.module.css"
import { InputVoting } from "../input/inputVoting";

interface RowVotingProps {
    agenda: IAgenda
}

export const RowVotingCandidates = (props: RowVotingProps): JSX.Element => {
    const agenda = props.agenda

    const [arrowRotate, setArrowRotate] = useState<{ [key: number]: boolean }>({});

    const toggleArrow = (id: number) => {
        setArrowRotate(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

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
                            <div className="w-[270px] flex gap-3.5 items-center">
                                <div>
                                    Количество кумулятивных голосов:
                                </div>
                                <div className="
                                                            border-[0.5px] 
                                                            border-black 
                                                            bg-(--color-gray) 
                                                            w-[40px] 
                                                            py-[5px] 
                                                            px-2">
                                    500
                                </div>
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
                            checked={false}
                            onChange={() => { }}
                            voting={true}
                        />
                    </div>
                    <div className="border-r-[0.5px] flex items-center justify-center py-5">
                        <Checkbox
                            checked={false}
                            onChange={() => { }}
                            voting={true}
                        />
                    </div>
                    <div className="flex items-center justify-center py-5">
                        <Checkbox
                            checked={false}
                            onChange={() => { }}
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
                            <div className={`${styles.borderTop} border-l-[1px] border-l-black py-2 px-8`}>
                                <InputVoting value="100" onChange={() => {}}/>
                            </div>
                            <div className={`border-l-[1px] border-l-black ${idx === 0 ? 'border-t-[1px]' : ''}`}></div>
                            <div className={`border-l-[1px] border-l-black ${idx === 0 ? 'border-t-[1px]' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}