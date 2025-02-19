import plus from "../../assets/plus.svg";
import minus from "../../assets/minus.svg";
import edit from "../../assets/edit.svg";
import { useEffect, useState } from "react";
import { Modal } from "../modal/modal";
import { TextArea } from "../textArea/textArea";
import { InputFile } from "../input/inputFile";
import { Checkbox } from "../checkbox/checkbox";
import { Input } from "../input/input";
import ok from "../../assets/arrowCheckbox.svg"
import { Button } from "../button/button";

export interface IAgenda {
    number: number;
    question: string;
    candidates: string[];
    materials: File[];
    solution: string;
    cumulativeVotes: boolean;

}

interface IRowProps {
    agenda: IAgenda | null
    onChange: (value: IAgenda) => void
    onDelete?: (index: number) => void
    index: number
}

export const Row = (props: IRowProps) => {
    const { agenda, index, onChange, onDelete } = props

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(!!agenda);
    const [question, setQuestion] = useState(agenda ? agenda.question : '');
    const [answer, setAnswer] = useState(agenda ? agenda.solution : '');
    const [checked, setChecked] = useState(agenda ? agenda.cumulativeVotes : false);
    const [candidates, setCandidates] = useState(agenda ? agenda.candidates : []);
    const [materials, setMaterials] = useState<File[]>([]);

    useEffect(() => {
        if (agenda) {
            setQuestion(agenda.question);
            setAnswer(agenda.solution);
            setChecked(agenda.cumulativeVotes);
            setCandidates(agenda.candidates);
            setMaterials(agenda.materials);
        } else {
            setQuestion('');
            setAnswer('');
            setChecked(false);
            setCandidates([]);
            setMaterials([]);
        }
    }, [agenda]);

    const handleClickPlus = () => {
        setIsOpenModal(true)
        setIsEditing(false)
    }

    const handleCloseModal = () => {
        setIsOpenModal(false)
        if (!isEditing) {
            setQuestion('');
            setAnswer('');
            setChecked(false);
            setCandidates([]);
            setMaterials([]);
        }
    }

    const handleChangeCandidate = (candidate: string, index: number) => {
        const newCandidates = [...candidates];
        newCandidates[index] = candidate;
        setCandidates(newCandidates);
    }

    const onClickAddCanditate = () => {
        setCandidates([...candidates, ''])
    }

    const onClickRemoveCandidate = (index: number) => {
        const newCandidates = candidates.filter((_, i) => i !== index);
        setCandidates(newCandidates);
    };

    const handleClickSave = (
    ) => {
        const newAgenda: IAgenda = {
            number: index,
            question,
            candidates,
            materials,
            solution: answer,
            cumulativeVotes: checked
        }
        onChange(newAgenda)
        setQuestion('');
        setAnswer('');
        setChecked(false);
        setCandidates([]);
        setMaterials([]);
        setIsOpenModal(false)
    }

    const handleClickEdit = () => {
        setIsOpenModal(true)
        setIsEditing(true)
    }

    const handleClickDelete = () => {
        if (onDelete) {
            onDelete(index - 1)
        }
    }
    
    return (
        <>
            <div className="
                            grid 
                            grid-cols-[42px_112px_232px_165px_257px_149px] 
                            w-[962px] 
                            align-middle
                            text-left     
                            gap-x-[1px]  
                            bg-white    
                            mt-[1px]                         
                            ">
                <div className="w-[42px] outline-[0.5px] text-center p-[10px]">
                    {
                        agenda === null
                            ? <button
                                className="cursor-pointer"
                                onClick={handleClickPlus}
                            >
                                <img src={plus} />
                            </button>
                            : <>
                                <button className="mb-5 cursor-pointer" onClick={handleClickDelete}>
                                    <img src={minus} />
                                </button>
                                <button className="cursor-pointer" onClick={handleClickEdit}>
                                    <img src={edit}/>
                                </button>
                            </>
                    }
                </div>
                <div className="outline-[0.5px] flex items-center justify-center">
                    {agenda?.number}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex items-center">
                    {agenda?.question}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex flex-col justify-center ">
                    {agenda?.candidates.map((candidate, index) => <div key={index}>{candidate}</div>)}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex items-center">
                    {agenda?.solution}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex items-center justify-center">
                    {agenda?.cumulativeVotes ? <img src={ok} /> : ''}
                </div>
            </div>
            {isOpenModal && (
                <Modal onClose={handleCloseModal} visible={isOpenModal}>
                    <div className="w-full text-center text-(--color-red) font-bold text-base">
                        Добавить вопрос в повестку дня
                    </div>
                    <div className="grid gap-[28px]">
                        <TextArea
                            label="Введите текст вопроса:"
                            value={question}
                            onChange={setQuestion}
                            placeholder="Текст вопроса"
                        />
                        <div>
                            <div className="mb-[7px]">Добавьте кандидата/подвопрос:</div>
                            {candidates.map((candidate, index) =>
                            (
                                <div className="flex items-center mb-3.5">
                                    <button className="cursor-pointer mr-[7px]" onClick={() => onClickRemoveCandidate(index)}>
                                        <img src={minus} />
                                    </button>
                                    <Input
                                        value={candidate}
                                        key={index}
                                        placeholder=""
                                        onChange={(value) => handleChangeCandidate(value, index)} />
                                </div>

                            )
                            )}
                            <button onClick={onClickAddCanditate} className="cursor-pointer">
                                <img src={plus} />
                            </button>
                        </div>
                        <TextArea
                            label="Введите текст решения вопроса:"
                            value={answer}
                            onChange={setAnswer}
                            placeholder="Текст решения"
                        />
                        <div>
                            <div className="mb-[7px]">Загрузить материалы вопроса:</div>
                            <InputFile onFileSelected={setMaterials} />
                        </div>
                        <div className="flex items-center">
                            <div className="mr-3.5">
                                Кумулятивные голоса
                            </div>
                            <Checkbox checked={checked} onChange={setChecked} />
                        </div>
                        <div className="flex justify-center gap-[100px]">
                            <Button title="Выйти без сохранения" onClick={handleCloseModal} color="empty" />
                            <Button
                                title="Сохранить вопрос"
                                onClick={handleClickSave}
                                color="yellow" />
                        </div>
                    </div>

                </Modal>
            )}
        </>
    )
};