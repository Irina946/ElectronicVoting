import { JSX, useState } from "react";
import { Select } from "../../../components/select/select";
import { Checkbox } from "../../../components/checkbox/checkbox";
import { InputDate } from "../../../components/input/inputDate";
import { InputTime } from "../../../components/input/inputTime";
import { IAgenda, Row } from "../../../components/row/row";
import { InputFile } from "../../../components/input/inputFile";
import { Button } from "../../../components/button/button";
import { useNavigate } from "react-router";
import { Modal } from "../../../components/modal/modal";
import { Input } from "../../../components/input/input";

const optionsType = [
    { label: 'Годовое собрание', value: true, repeat: false },
    { label: 'Внеочередное собрание', value: false, repeat: false },
    { label: 'Годовое повторное собрание', value: true, repeat: true },
    { label: 'Внеочередное повторное собрание', value: false, repeat: true },
]

const optionsPlace = [
    { label: 'Собрание', value: true },
    { label: 'Заочное собрание', value: false },
]

const optionsIssuer = [
    { label: 'Акционерное общество “Предприятие №1”', value: 'number 1' },
    { label: 'Акционерное общество “Предприятие №2”', value: 'number 2' },
    { label: 'Акционерное общество “Предприятие №3”', value: 'number 3' },
    { label: 'Акционерное общество “Предприятие №4”', value: 'number 4' },
    { label: 'Акционерное общество “Предприятие №5”', value: 'number 5' },
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

const addTimedate = (date: string, time: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(time.getHours(), time.getMinutes(), 0, 0)
    return newDate
}


export const NewMessage = (): JSX.Element => {
    // const location = useLocation()
    // const idMessage: {id: number} = location.state

    const [selectedType, setSelectedType] = useState<{ value: boolean | string, repeat?: boolean }>({ value: false, repeat: false });
    const [selectedForm, setSelectedForm] = useState<boolean | string>(false);
    const [selectedIssuer, setSelectedIssuer] = useState<string | boolean>('');
    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [checked, setChecked] = useState(false);
    const [checkedEarlyRegistration, setCheckedEarlyRegistration] = useState(false);
    const newDate = new Date();
    const [selectedDateAcceptance, setSelectedDateAcceptance] = useState(newDate.toISOString().split('T')[0]);
    const [selectedDateDefinition, setSelectedDateDefinition] = useState(newDate.toISOString().split('T')[0]);
    const [selectedDateRegisterStart, setSelectedDateRegisterStart] = useState(newDate.toISOString().split('T')[0]);
    const [selectedDateRegisterEnd, setSelectedDateRegisterEnd] = useState(newDate.toISOString().split('T')[0]);
    const [selectedTimeRegisterStart, setSelectedTimeRegisterStart] = useState<Date>(() => {
        const now = new Date();
        now.setHours(14, 0, 0, 0); // Устанавливаем начальное время 14:00:00.000
        return now;
    });
    const [selectedTimeRegisterEnd, setSelectedTimeRegisterEnd] = useState<Date>(() => {
        const now = new Date();
        now.setHours(14, 0, 0, 0); // Устанавливаем начальное время 14:00:00.000
        return now;
    });
    const [selectedDateMeeting, setSelectedDateMeeting] = useState(newDate.toISOString().split('T')[0]);
    const [selectedTimeMeetingFrom, setSelectedTimeMeetingFrom] = useState<Date>(() => {
        const now = new Date();
        now.setHours(14, 0, 0, 0); // Устанавливаем начальное время 14:00:00.000
        return now;
    });
    const [selectedTimeMeetingTo, setSelectedTimeMeetingTo] = useState<Date>(() => {
        const now = new Date();
        now.setHours(14, 0, 0, 0); // Устанавливаем начальное время 14:00:00.000
        return now;
    });
    const [selectedDateReceivingBallotsStart, setSelectedDateReceivingBallotsStart] = useState(newDate.toISOString().split('T')[0]);
    const [selectedDateReceivingBallotsEnd, setSelectedDateReceivingBallotsEnd] = useState(newDate.toISOString().split('T')[0]);
    const [selectedTimeReceivingBallotsStart, setSelectedTimeReceivingBallotsStart] = useState<Date>(() => {
        const now = new Date();
        now.setHours(14, 0, 0, 0); // Устанавливаем начальное время 14:00:00.000
        return now;
    });
    const [selectedTimeReceivingBallotsEnd, setSelectedTimeReceivingBallotsEnd] = useState<Date>(() => {
        const now = new Date();
        now.setHours(14, 0, 0, 0); // Устанавливаем начальное время 14:00:00.000
        return now;
    });
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

    const handleTimeChangeFrom = (hours: number, minutes: number) => {
        const newDate = new Date(selectedTimeMeetingFrom);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        setSelectedTimeMeetingFrom(newDate);
    };

    const handleTimeChangeTo = (hours: number, minutes: number) => {
        const newDate = new Date(selectedTimeMeetingTo);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        setSelectedTimeMeetingTo(newDate);
    };

    const handleTimeRegisterStartChange = (hours: number, minutes: number) => {
        const newDate = new Date(selectedTimeRegisterStart);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        setSelectedTimeRegisterStart(newDate);
    };

    const handleTimeRegisterEndChange = (hours: number, minutes: number) => {
        const newDate = new Date(selectedTimeRegisterEnd);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        setSelectedTimeRegisterEnd(newDate);
    };

    const handleTimeReceivingBallotsStart = (hours: number, minutes: number) => {
        const newDate = new Date(selectedTimeReceivingBallotsStart);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        setSelectedTimeReceivingBallotsStart(newDate);
    }

    const handleTimeReceivingBallotsEnd = (hours: number, minutes: number) => {
        const newDate = new Date(selectedTimeReceivingBallotsEnd);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        setSelectedTimeReceivingBallotsEnd(newDate);
    }

    const handleSaveMeeting = () => {

    

        console.log(
            {
                issuer_id: selectedIssuer,
                annual_or_unscheduled: selectedType.value,
                first_or_repeated: selectedType.repeat,
                inter_or_extra_mural: selectedForm,
                meeting_location: selectedPlace,
                preferred_shares: checked,
                decision_date: new Date(selectedDateAcceptance),
                record_date: new Date(selectedDateDefinition),
                registration_start_date: addTimedate(selectedDateRegisterStart, selectedTimeRegisterStart),
                registration_end_date: addTimedate(selectedDateRegisterEnd, selectedTimeRegisterEnd),
                meeting_date_start: addTimedate(selectedDateMeeting, selectedTimeMeetingFrom),
                meeting_date_close: addTimedate(selectedDateMeeting, selectedTimeMeetingTo ),
                early_registration: checkedEarlyRegistration,
                ballots_start_date: addTimedate(selectedDateReceivingBallotsStart, selectedTimeReceivingBallotsStart),
                ballots_end_date: addTimedate(selectedDateReceivingBallotsEnd, selectedTimeReceivingBallotsEnd),
                agendas: agendas,
                materials: files
            }
        );
    }



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
                        Наименование эмитента:
                    </div>
                    <div className="w-[424px]">
                        <Select
                            options={optionsIssuer}
                            placeholder="Выберите эмитента"
                            onChange={(value) => setSelectedIssuer(value)}
                        />
                    </div>
                    <div>
                        Вид проведения собрания:
                    </div>
                    <div className="w-[424px]">
                        <Select
                            options={optionsType}
                            placeholder="Выберите вид собрания"
                            onChange={(value, repeat) => setSelectedType({ value, repeat })}
                        />
                    </div>
                    <div>
                        Форма проведения собрания:
                    </div>
                    <div className="w-[424px]">
                        <Select
                            options={optionsPlace}
                            placeholder="Выберите форму собрания"
                            onChange={(value) => setSelectedForm(value)}
                        />
                    </div>
                    <div>
                        Место проведения собрания:
                    </div>
                    <div>
                        <Input value={selectedPlace} onChange={(value) => setSelectedPlace(value)} placeholder="Введите место" />
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
                    <div className="flex items-center w-[374px] justify-between">
                        <div>
                            Дата начала регистрации:
                        </div>
                        <InputDate
                            value={selectedDateRegisterStart}
                            onChange={setSelectedDateRegisterStart}
                        />
                    </div>
                    <div className="flex items-center w-[348px] justify-between">
                        <div className="mr-[28px]">
                            Время начала регистрации:
                        </div>
                        <InputTime onTimeChange={handleTimeRegisterStartChange} />
                    </div>
                    <div className="flex items-center w-[374px] justify-between">
                        <div className="mr-[28px]">
                            Дата окончания регистрации:
                        </div>
                        <InputDate
                            value={selectedDateRegisterEnd}
                            onChange={setSelectedDateRegisterEnd}
                        />
                    </div>
                    <div className="flex items-center w-[348px] justify-between">
                        <div className="mr-[28px]">
                            Время окончания регистрации:
                        </div>
                        <InputTime onTimeChange={handleTimeRegisterEndChange} />
                    </div>
                    <div className="flex items-center w-[374px] justify-between">
                        <div className="mr-[28px]">
                            Дата проведения собрания:
                        </div>
                        <InputDate
                            value={selectedDateMeeting}
                            onChange={setSelectedDateMeeting}
                        />
                    </div>
                    <div className="flex items-center w-[348px] justify-between">
                        <div className="mr-[28px]">
                            Время собрания с
                        </div>
                        <InputTime onTimeChange={handleTimeChangeFrom} />
                        <div>
                            до
                        </div>
                        <InputTime onTimeChange={handleTimeChangeTo} />
                    </div>
                    <div className="flex items-center w-[275px] justify-between">
                        <div>
                            Досрочная регистрация:
                        </div>
                        <Checkbox
                            checked={checkedEarlyRegistration}
                            onChange={() => { setCheckedEarlyRegistration(!checkedEarlyRegistration) }}
                        />
                    </div>
                    {checkedEarlyRegistration && <>
                        <div></div>
                        <div className="flex items-center w-[374px] justify-between">
                            <div>
                                Дата начала приема бюллетеней:
                            </div>
                            <InputDate
                                value={selectedDateReceivingBallotsStart}
                                onChange={setSelectedDateReceivingBallotsStart}
                            />
                        </div>
                        <div className="flex items-center w-[348px] justify-between">
                            <div >
                                Время начала приема бюллетеней:
                            </div>
                            <InputTime onTimeChange={handleTimeReceivingBallotsStart} />
                        </div>
                        <div className="flex items-center w-[374px] justify-between">
                            <div>
                                Дата окончания приема бюллетеней:
                            </div>
                            <InputDate
                                value={selectedDateReceivingBallotsEnd}
                                onChange={setSelectedDateReceivingBallotsEnd}
                            />
                        </div>
                        <div className="flex items-center w-[348px] justify-between">
                            <div>
                                Время окончания приема бюллетеней:
                            </div>
                            <InputTime onTimeChange={handleTimeReceivingBallotsEnd} />
                        </div>
                    </>}

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
                    <Button title="Сохранить сообщение" onClick={handleSaveMeeting} color="yellow" />
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