import { JSX, useEffect, useState } from "react";
import { Option, Select } from "../../../components/select/select";
import { Checkbox } from "../../../components/checkbox/checkbox";
import { InputDate } from "../../../components/input/inputDate";
import { InputTime } from "../../../components/input/inputTime";
import { Row } from "../../../components/row/row";
import { InputFile } from "../../../components/input/inputFile";
import { Button } from "../../../components/button/button";
import { useLocation, useNavigate } from "react-router";
import { Modal } from "../../../components/modal/modal";
import { Input } from "../../../components/input/input";
import { getDraftForId, getListCompany, postMeetingCreate, putDraft } from "../../../requests/requests";
import { IAgendaCreate, IListCompany, IMeetingCreate } from "../../../requests/interfaces";
import { HeaderRow } from "../../../components/row/headerRow";
import { Alert } from "../../../components/modal/alert";

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

const addTimedate = (date: string, time: Date): Date => {
    if (!(time instanceof Date)) {
        throw new Error("The 'time' parameter must be a Date object");
    }

    const newDate = new Date(date);
    newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return newDate;
}

export interface IMeetingUpdate extends IMeetingCreate {
    meeting_name: string | null;
    status: number;
    meeting_url: string | null;
}

const mapMeetingCreateToFormStateEdit = (data: IMeetingUpdate): IFormState => {
    return {
        selectedType: {
            value: data.annual_or_unscheduled,
            repeat: data.first_or_repeated
        },
        selectedForm: data.inter_or_extra_mural,
        selectedIssuer: data.issuer,
        selectedPlace: data.meeting_location,
        checkedEarlyRegistration: data.early_registration,
        selectedDateAcceptance: data.decision_date,
        selectedDateDefinition: data.record_date,
        selectedDateRegisterStart: data.record_date,
        selectedDateRegisterEnd: data.deadline_date,
        selectedTimeRegisterStart: data.checkin,
        selectedTimeRegisterEnd: data.closeout,
        selectedDateMeeting: data.meeting_date,
        selectedTimeMeetingFrom: data.meeting_open,
        selectedTimeMeetingTo: data.meeting_close,
        selectedDateReceivingBallotsStart: "",
        selectedDateReceivingBallotsEnd: "",
        selectedTimeReceivingBallotsStart: new Date(data.record_date),
        selectedTimeReceivingBallotsEnd: new Date(),
        agendas: data.agenda,
        files: data.file,
        meeting_name: data.meeting_name,
        status: data.status,
        meeting_url: data.meeting_url
    };
};

// const mapMeetingCreateToFormState = (data: IMeetingCreate): IFormState => {
//     return {
//         selectedType: {
//             value: data.annual_or_unscheduled,
//             repeat: data.first_or_repeated
//         },
//         selectedForm: data.inter_or_extra_mural,
//         selectedIssuer: data.issuer,
//         selectedPlace: data.meeting_location,
//         checkedEarlyRegistration: data.early_registration,
//         selectedDateAcceptance: data.decision_date,
//         selectedDateDefinition: data.record_date,
//         selectedDateRegisterStart: data.record_date,
//         selectedDateRegisterEnd: data.deadline_date || "",
//         selectedTimeRegisterStart: data.checkin,
//         selectedTimeRegisterEnd: data.closeout,
//         selectedDateMeeting: data.meeting_date,
//         selectedTimeMeetingFrom: data.meeting_open,
//         selectedTimeMeetingTo: data.meeting_close,
//         selectedDateReceivingBallotsStart: "",
//         selectedDateReceivingBallotsEnd: "",
//         selectedTimeReceivingBallotsStart: new Date(data.record_date),
//         selectedTimeReceivingBallotsEnd: new Date(),
//         agendas: data.agenda,
//         files: data.file,
//     };
// };


interface IFormState {
    selectedType: { value: boolean | number; repeat?: boolean };
    selectedForm: boolean | number;
    selectedIssuer?: number | boolean;
    selectedPlace: string;
    checkedEarlyRegistration: boolean;
    selectedDateAcceptance: string;
    selectedDateDefinition: string;
    selectedDateRegisterStart: string;
    selectedDateRegisterEnd: string;
    selectedTimeRegisterStart: Date;
    selectedTimeRegisterEnd: Date;
    selectedDateMeeting: string;
    selectedTimeMeetingFrom: Date;
    selectedTimeMeetingTo: Date;
    selectedDateReceivingBallotsStart: string;
    selectedDateReceivingBallotsEnd: string;
    selectedTimeReceivingBallotsStart: Date;
    selectedTimeReceivingBallotsEnd: Date;
    agendas: IAgendaCreate[];
    files: File[];
    meeting_name?: string | null;
    status?: number;
    meeting_url?: string | null;
}

const newDate = new Date().toISOString().split('T')[0];

const getTimeFromString = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
};

const initialTime = getTimeFromString('14:00');

export const NewMessage = (): JSX.Element => {
    const location = useLocation()
    const idMessage: { id: number } = location.state ? location.state : { id: -1 }
    const [listCompany, setListCompany] = useState<IListCompany[]>([]);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [checked, setChecked] = useState<boolean>(false);

    const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false)

    const [formState, setFormState] = useState<IFormState>({
        selectedType: { value: false, repeat: false },
        selectedForm: false,
        selectedIssuer: undefined,
        selectedPlace: '',
        checkedEarlyRegistration: false,
        selectedDateAcceptance: newDate,
        selectedDateDefinition: newDate,
        selectedDateRegisterStart: newDate,
        selectedDateRegisterEnd: newDate,
        selectedTimeRegisterStart: initialTime,
        selectedTimeRegisterEnd: initialTime,
        selectedDateMeeting: newDate,
        selectedTimeMeetingFrom: initialTime,
        selectedTimeMeetingTo: initialTime,
        selectedDateReceivingBallotsStart: newDate,
        selectedDateReceivingBallotsEnd: newDate,
        selectedTimeReceivingBallotsStart: initialTime,
        selectedTimeReceivingBallotsEnd: initialTime,
        agendas: [],
        files: []
    });

    function updateState<K extends keyof IFormState>(key: K, value: IFormState[K]) {
        setFormState(prevState => ({
            ...prevState,
            [key]: value as IFormState[typeof key]
        }));
    }

    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname.includes('edit') && idMessage.id !== -1) {
            const getMeeting = async () => {
                try {
                    const data = await getDraftForId(idMessage.id)
                    setFormState(mapMeetingCreateToFormStateEdit(data))
                } catch (error) {
                    console.error("Error fetching message:", error);
                }
            };
            getMeeting()
        }
    }, [idMessage.id, location.pathname])

    const handleExit = () => {
        navigate('/admin');
    }

    const handelNewQuestion = (question: IAgendaCreate) => {
        updateState('agendas', [...formState.agendas, { ...question }]);
    }

    const handelDeleteQuestion = (uniqueId: number) => {
        updateState('agendas', formState.agendas.filter(agenda => agenda.questionId !== uniqueId));
    };

    const handleUpdateQuestion = (updatedQuestion: IAgendaCreate, index: number) => {
        const newAgendas = [...formState.agendas];
        newAgendas[index] = updatedQuestion;
        updateState('agendas', newAgendas);
    };

    const handleTimeChangeFrom = (hours: number, minutes: number) => {
        const newDate = new Date(formState.selectedTimeMeetingFrom);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        updateState('selectedTimeMeetingFrom', newDate);
    };

    const handleTimeChangeTo = (hours: number, minutes: number) => {
        const newDate = new Date(formState.selectedTimeMeetingTo);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        updateState('selectedTimeMeetingTo', newDate);
    };

    const handleTimeRegisterStartChange = (hours: number, minutes: number) => {
        const newDate = new Date(formState.selectedTimeRegisterStart);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        updateState('selectedTimeRegisterStart', newDate);
    };

    const handleTimeRegisterEndChange = (hours: number, minutes: number) => {
        const newDate = new Date(formState.selectedTimeRegisterEnd);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        updateState('selectedTimeRegisterEnd', newDate);
    };

    const handleTimeReceivingBallotsStart = (hours: number, minutes: number) => {
        const newDate = new Date(formState.selectedTimeReceivingBallotsStart);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        updateState('selectedTimeReceivingBallotsStart', newDate);
    }

    const handleTimeReceivingBallotsEnd = (hours: number, minutes: number) => {
        const newDate = new Date(formState.selectedTimeReceivingBallotsEnd);
        newDate.setHours(hours, minutes, 0, 0); // Устанавливаем новые часы и минуты
        updateState('selectedTimeReceivingBallotsEnd', newDate);
    }

    useEffect(() => {
        const getCompany = async () => {
            try {
                const data = await getListCompany();
                setListCompany(data)
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getCompany()

    }, [])

    const handleSaveMeeting = async () => {
        const getTime = (time: Date | string): Date => {
            if (typeof time === 'string') {
                return new Date(time);  // Преобразуем строку в объект Date
            }
            return time;  // Если это уже Date, просто возвращаем его
        };

        try {
            if (location.pathname.includes('edit')) {
                await putDraft(idMessage.id, {
                    meeting_id: idMessage.id,
                    issuer: Number(formState.selectedIssuer),
                    annual_or_unscheduled: formState.selectedType.value as boolean,
                    first_or_repeated: formState.selectedType.repeat as boolean,
                    inter_or_extra_mural: formState.selectedForm as boolean,
                    meeting_location: formState.selectedPlace,
                    decision_date: formState.selectedDateAcceptance,
                    record_date: formState.selectedDateDefinition,
                    checkin: addTimedate(formState.selectedDateRegisterStart, getTime(formState.selectedTimeRegisterStart)),
                    closeout: addTimedate(formState.selectedDateRegisterEnd, getTime(formState.selectedTimeRegisterEnd)),
                    meeting_open: addTimedate(formState.selectedDateMeeting, getTime(formState.selectedTimeMeetingFrom)),
                    meeting_close: addTimedate(formState.selectedDateMeeting, getTime(formState.selectedTimeMeetingTo)),
                    early_registration: formState.checkedEarlyRegistration,
                    deadline_date: formState.selectedDateReceivingBallotsEnd || formState.selectedDateMeeting,
                    agenda: formState.agendas,
                    file: formState.files,
                    meeting_date: formState.selectedDateMeeting,
                    vote_counting: addTimedate(formState.selectedDateReceivingBallotsStart, getTime(formState.selectedTimeReceivingBallotsStart)),
                    meeting_name: formState.meeting_name || '',
                    meeting_url: formState.meeting_url || '',
                    status: formState.status || 1
                });
            } else {
                await postMeetingCreate({
                    issuer: Number(formState.selectedIssuer),
                    annual_or_unscheduled: formState.selectedType.value as boolean,
                    first_or_repeated: formState.selectedType.repeat as boolean,
                    inter_or_extra_mural: formState.selectedForm as boolean,
                    meeting_location: formState.selectedPlace,
                    decision_date: formState.selectedDateAcceptance,
                    record_date: formState.selectedDateDefinition,
                    checkin: addTimedate(formState.selectedDateRegisterStart, getTime(formState.selectedTimeRegisterStart)),
                    closeout: addTimedate(formState.selectedDateRegisterEnd, getTime(formState.selectedTimeRegisterEnd)),
                    meeting_open: addTimedate(formState.selectedDateMeeting, getTime(formState.selectedTimeMeetingFrom)),
                    meeting_close: addTimedate(formState.selectedDateMeeting, getTime(formState.selectedTimeMeetingTo)),
                    early_registration: formState.checkedEarlyRegistration,
                    deadline_date: formState.selectedDateReceivingBallotsEnd,
                    agenda: formState.agendas,
                    file: formState.files,
                    meeting_date: formState.selectedDateMeeting,
                    vote_counting: addTimedate(formState.selectedDateReceivingBallotsStart, getTime(formState.selectedTimeReceivingBallotsStart))
                });
            }

            // Успешное завершение запроса
            setIsOpenAlert(true);

        } catch (error) {
            // Обработка ошибки запроса
            console.error('Ошибка при сохранении встречи:', error);
            // Здесь можно также показать уведомление о неудаче
        }
    };





    const parseListCompanyToOptions = (companies: IListCompany[]): Option[] => {
        return companies.map(company => ({
            label: company.full_name,
            value: company.issuer_id
        }));
    }

    const newOptions = parseListCompanyToOptions(listCompany);


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
                            options={newOptions}
                            placeholder="Выберите эмитента"
                            onChange={(value) => updateState('selectedIssuer', value)}
                            value={formState.selectedIssuer}
                        />
                    </div>
                    <div>
                        Вид проведения собрания:
                    </div>
                    <div className="w-[424px]">
                        <Select
                            options={optionsType}
                            placeholder="Выберите вид собрания"
                            onChange={(value, repeat) => updateState('selectedType', { value, repeat })}
                            value={formState.selectedType.value}
                        />
                    </div>
                    <div>
                        Форма проведения собрания:
                    </div>
                    <div className="w-[424px]">
                        <Select
                            options={optionsPlace}
                            placeholder="Выберите форму собрания"
                            onChange={(value) => updateState('selectedForm', value)}
                            value={formState.selectedForm}
                        />
                    </div>
                    <div>
                        Место проведения собрания:
                    </div>
                    <div>
                        <Input value={formState.selectedPlace} onChange={(value) => updateState('selectedPlace', value)} placeholder="Введите место" />
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
                        value={formState.selectedDateAcceptance}
                        onChange={(e) => updateState('selectedDateAcceptance', e)}
                    />
                    <div>
                        Дата определения (фиксации) лиц:
                    </div>
                    <InputDate
                        value={formState.selectedDateDefinition}
                        onChange={(e) => updateState('selectedDateDefinition', e)}
                    />
                    <div className="flex items-center w-[374px] justify-between">
                        <div>
                            Дата начала регистрации:
                        </div>
                        <InputDate
                            value={formState.selectedDateRegisterStart}
                            onChange={(e) => updateState('selectedDateRegisterStart', e)}
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
                            value={formState.selectedDateRegisterEnd}
                            onChange={(e) => updateState('selectedDateRegisterEnd', e)}
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
                            value={formState.selectedDateMeeting}
                            onChange={(e) => updateState('selectedDateMeeting', e)}
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
                            checked={formState.checkedEarlyRegistration}
                            onChange={() => updateState('checkedEarlyRegistration', !formState.checkedEarlyRegistration)}
                        />
                    </div>
                    {formState.checkedEarlyRegistration && <>
                        <div></div>
                        <div className="flex items-center w-[374px] justify-between">
                            <div>
                                Дата начала приема бюллетеней:
                            </div>
                            <InputDate
                                value={formState.selectedDateReceivingBallotsStart}
                                onChange={(e) => updateState('selectedDateReceivingBallotsStart', e)}
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
                                value={formState.selectedDateReceivingBallotsEnd}
                                onChange={(e) => updateState('selectedDateReceivingBallotsEnd', e)}
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
                    <HeaderRow />
                    {formState.agendas.map((agenda, index) =>
                        <Row
                            key={index}
                            agenda={agenda}
                            index={index + 1}
                            onChange={handleUpdateQuestion}
                            onDelete={handelDeleteQuestion}
                        />)}
                    <Row
                        agenda={null}
                        index={formState.agendas.length + 1}
                        onChange={handelNewQuestion}
                        onDelete={handelDeleteQuestion}
                    />

                </div>
                <div className="mt-7 mb-[7px]">Загрузить материалы:</div>
                <InputFile onFileSelected={(e) => updateState('files', [...(formState.files || []), e] as File[])} />
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
            {isOpenAlert && <Alert onClose={() => setIsOpenAlert(false)} message="Сообщение сохранено " />}
        </div>
    )
}