import { JSX, useState } from "react";
import { Select } from "../../components/select/select";
import { Checkbox } from "../../components/checkbox/checkbox";
import { InputDate } from "../../components/input/inputDate";
import { InputTime } from "../../components/input/inputTime";
import { IAgenda, Row } from "../../components/row/row";
import { InputFile } from "../../components/input/inputFile";
import { Button } from "../../components/button/button";
import { useNavigate } from "react-router";
import { Modal } from "../../components/modal/modal";

const optionsType = [
    { label: 'Годовое собрание', value: 'year' },
    { label: 'Внеочередное собрание', value: 'not' },
]

const optionsPlace = [
    { label: 'Собрание', value: 'meeting' },
    { label: 'Заочное собрание', value: 'correspondence meeting' },
]

const agendaArray: IAgenda[] = [
    {
        number: 1,
        question: 'Избрание Совета директоров Общества.',
        candidates: [
            'Иванов Иван Иванович',
            'Петров Петр Петрович',
            'Сидоров Сидор Сидорович',
        ],
        solution: 'Избрать членов Совета директоров общества следующим составом:',
        materials: [],
        cumulativeVotes: true
    }
]


export const NewMessage = (): JSX.Element => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedPlace, setSelectedPlace] = useState('');
    const [checked, setChecked] = useState(false);
    const newDate = new Date();
    const [selectedDateAcceptance, setSelectedDateAcceptance] = useState(newDate.toISOString().split('T')[0]);
    const [selectedDateDefinition, setSelectedDateDefinition] = useState(newDate.toISOString().split('T')[0]);
    const [selectedDateMeeting, setSelectedDateMeeting] = useState(newDate.toISOString().split('T')[0]);
    const [selectedTimeMeeting, setSelectedTimeMeeting] = useState({ hours: 14, minutes: 0 });
    const [agendas, setAgendas] = useState<IAgenda[]>(agendaArray);
    const [files, setFiles] = useState<File[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/generalMeetingShareholders');
    }

    const handelNewQuestion = (question: IAgenda) => {
        setAgendas(prevAgendas => [...prevAgendas, question]);
    }

    const handelDeleteQuestion = (index: number) => {
        setAgendas(prevAgendas => prevAgendas.filter((_, i) => i !== index));
    }

    const handleUpdateQuestion = (updatedQuestion: IAgenda) => {
        setAgendas(prevAgendas =>
            prevAgendas.map(agenda =>
                agenda.number === updatedQuestion.number ? updatedQuestion : agenda
            )
        );
    }

    const handleTimeChange = (hours: number, minutes: number) => {
        setSelectedTimeMeeting({ hours, minutes });
    };

    console.log(selectedType,
        selectedPlace,
        checked,
        selectedDateAcceptance,
        selectedDateDefinition,
        selectedDateMeeting,
        selectedTimeMeeting,
        agendas,
        files

    );

    return (
        <div className="w-[1016px] m-auto">
            <h1 className="text-[32px] text-(--color-text) mt-[26px] mb-[20px]">Создать сообщение</h1>
            <div className="
                                w-full 
                                border-[0.5px] 
                                border-black 
                                rounded-2xl 
                                bg-(--color-button-active) 
                                p-[28px] 
                                mb-[28px] 
                                text-(--color-text)
                                text-sm">
                <div className="w-full text-center text-(--color-red) font-bold text-base mb-[28px]">
                    Создать сообщение
                </div>
                <div className="
                                grid 
                                grid-cols-[384px_424px] 
                                gap-x-[28px] 
                                gap-y-[21px]
                                mb-6
                                ">
                    <div>
                        Вид проведения собрания:
                    </div>
                    <div className="w-[424px]">
                        <Select
                            options={optionsType}
                            placeholder="Выберите вид собрания"
                            onChange={(value) => { setSelectedType(value) }}
                        />
                    </div>
                    <div>
                        Форма проведения собрания:
                    </div>
                    <div className="w-[424px]">
                        <Select
                            options={optionsPlace}
                            placeholder="Выберите форму собрания"
                            onChange={(value) => { setSelectedPlace(value) }}
                        />
                    </div>
                    <div>
                        Наличие права голоса владельцев привилегированных акций:
                    </div>
                    <Checkbox
                        checked={checked}
                        onChange={() => { setChecked(!checked) }}
                    />
                    <div>
                        Дата принятия решения о созыве собрания:
                    </div>
                    <InputDate
                        value={selectedDateAcceptance}
                        onChange={setSelectedDateAcceptance}
                    />
                    <div>
                        Дата определения (фиксации) лиц:
                    </div>
                    <InputDate
                        value={selectedDateDefinition}
                        onChange={setSelectedDateDefinition}
                    />
                    <div className="flex items-center">
                        <div className="mr-[28px]">
                            Дата проведения собрания:
                        </div>
                        <InputDate
                            value={selectedDateMeeting}
                            onChange={setSelectedDateMeeting}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="mr-[28px]">
                            Время проведения собрания:
                        </div>
                        <InputTime onTimeChange={handleTimeChange} />
                    </div>
                </div>
                Повестка дня:
                <div className="mt-7">
                    <div className="
                                    grid 
                                    grid-cols-[42px_112px_232px_165px_257px_149px] 
                                    w-[962px] 
                                    h-[42px]
                                    align-middle
                                    text-left     
                                    gap-x-[1px]  
                                    bg-white                             
                                    ">
                        <div className="w-[42px] h-[42px] outline-[0.5px] ">

                        </div>
                        <div className="outline-[0.5px] pl-[10px] flex items-center">
                            Номер вопроса
                        </div>
                        <div className="outline-[0.5px] pl-[10px] flex items-center">
                            Вопрос
                        </div>
                        <div className="outline-[0.5px] pl-[10px] flex items-center">
                            Кандидаты/подвопросы
                        </div>
                        <div className="outline-[0.5px] pl-[10px] flex items-center">
                            Решение
                        </div>
                        <div className="outline-[0.5px] pl-[10px] flex items-center">
                            Кумулятивные голоса
                        </div>
                    </div>
                    {agendas.map((agenda, index) =>
                        <Row
                            key={index}
                            agenda={agenda}
                            index={index + 1}
                            onChange={handleUpdateQuestion}
                            onDelete={handelDeleteQuestion}
                        />)}
                    <Row
                        agenda={null}
                        index={agendas.length + 1}
                        onChange={handelNewQuestion}
                        onDelete={handelDeleteQuestion}
                    />

                </div>
                <div className="mt-7 mb-[7px]">Загрузить материалы:</div>
                <InputFile onFileSelected={setFiles} />
                <div className="flex justify-center items-center mt-7 gap-[275px]">
                    <Button title="Выйти без сохранения" onClick={() => setIsOpenModal(true)} color="empty" />
                    <Button title="Сохранить сообщение" onClick={() => { }} color="yellow" />
                </div>
            </div>
            {isOpenModal && <Modal onClose={() => setIsOpenModal(false)} visible={isOpenModal} type="warning">
                <div className="flex items-center flex-col text-(--color-text) text-lg">
                    <p className="mb-[7px]">Вы уверены, что хотите выйти из раздела создания сообщения?</p>
                    <p>Все несохранённые данные удалятся!</p>
                    <div className="mt-14 flex gap-16">
                        <Button title="Продолжить" onClick={() => setIsOpenModal(false)} color="empty" />
                        <Button title="Выйти без сохранения" onClick={handleExit} color="empty" />
                    </div>
                </div>

            </Modal>}
        </div>
    )
}