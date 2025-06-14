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
import { IAgendaCreate, IAgendaDetails } from "../../requests/interfaces";

export interface IAgenda {
    number: number;
    question: string;
    candidates: string[];
    materials: File[];
    solution: string;
    cumulativeVotes: boolean;
    index: number
}

interface IRowProps {
    agenda: IAgendaCreate | null
    onChange: (value: IAgendaCreate, index: number) => void
    onDelete?: (index: number) => void
    index: number
}

export const Row = (props: IRowProps) => {
    const { agenda, index, onChange, onDelete } = props

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(!!agenda);
    const [question, setQuestion] = useState(agenda ? agenda.question : '');
    const [answer, setAnswer] = useState(agenda ? agenda.decision : '');
    const [checked, setChecked] = useState(agenda ? agenda.cumulative : false);
    const [candidates, setCandidates] = useState<IAgendaDetails[]>(agenda ? agenda.details || [] : []);
    const [materials, setMaterials] = useState<File[]>([]);
    

    useEffect(() => {
        if (agenda) {
            setQuestion(agenda.question);
            setAnswer(agenda.decision);
            setChecked(agenda.cumulative);
            setCandidates(agenda.details || []);
            // setMaterials(agenda.materials);
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

    const handleChangeCandidate = (detailText: string, index: number) => {
        if (!candidates) return;
        const newCandidates = [...candidates];
        newCandidates[index] = {detail_text: detailText};
        setCandidates(newCandidates);
    }

    const onClickAddCanditate = () => {
        if (!candidates) return;
        setCandidates([...candidates, {detail_text: ''}])
    }

    const onClickRemoveCandidate = (index: number) => {
        if (!candidates) return;
        const newCandidates = candidates.filter((_, i) => i !== index);
        setCandidates(newCandidates);
    };

    const handleClickSave = (
    ) => {
        const newAgenda: IAgendaCreate = {
            question: question,
            details: candidates,
            decision: answer,
            cumulative: checked,
            questionId: Number(new Date())
        }
        onChange(newAgenda, index - 1)
        setQuestion('');
        setAnswer('');
        setChecked(false);
        setCandidates([]);
        setMaterials([]);
        setIsOpenModal(false)
        console.log(materials)
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
                                className="cursor-pointer h-[15px]"
                                data-testid="plus-button"
                                onClick={handleClickPlus}
                            >
                                <img src={plus} alt="Добавить" />
                            </button>
                            : <>
                                <button
                                    className="cursor-pointer"
                                    data-testid="minus-button"
                                    onClick={handleClickDelete}
                                >
                                    <img src={minus} alt="Удалить" />
                                </button>
                                <button
                                    className="cursor-pointer"
                                    data-testid="edit-button"
                                    onClick={handleClickEdit}
                                >
                                    <img src={edit} alt="Редактировать" />
                                </button>
                            </>
                    }
                </div>
                <div className="outline-[0.5px] flex items-center justify-center">
                    {index}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex items-center">
                    {agenda?.question}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex flex-col justify-center ">
                    {agenda?.details?.map((candidate, index) => <div key={index}>{candidate.detail_text}</div>)}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex items-center">
                    {agenda?.decision}
                </div>
                <div className="outline-[0.5px] px-[10px] py-[7px] flex items-center justify-center">
                    {agenda?.cumulative ? <img src={ok} className="!w-[30px] !h-[30px]"/> : ''}
                </div>
            </div>
            {isOpenModal && (
                <Modal onClose={handleCloseModal} visible={isOpenModal} type="message">
                    <div className="w-full text-center text-(--color-red) font-bold text-base overflow-y-scroll h-max-[500px]">
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
                            <div className="mb-[14px]">Добавьте кандидата/подвопрос:</div>
                            {candidates.map((candidate, index) =>
                            (
                                <div key={`candidate-${index}`} className="flex items-center mb-3.5">
                                    <button className="cursor-pointer mr-[7px]" onClick={() => onClickRemoveCandidate(index)} >
                                        <img src={minus} alt="Удалить кандидата" width={15} height={15} />
                                    </button>
                                    <Input
                                        value={candidate.detail_text}
                                        key={`input-${index}`}
                                        placeholder=""
                                        onChange={(value) => handleChangeCandidate(value, index)} />
                                </div>

                            )
                            )}
                            <button onClick={onClickAddCanditate} className="cursor-pointer w-[18px] h-[18px]">
                                <img src={plus} width={18} height={18} />
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