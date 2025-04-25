import { JSX, useState } from "react";
import { Select } from "../../../components/select/select";
import { Checkbox } from "../../../components/checkbox/checkbox";
import { InputDate } from "../../../components/input/inputDate";
import { InputTime } from "../../../components/input/inputTime";
import { Row } from "../../../components/row/row";
import { InputFile } from "../../../components/input/inputFile";
import { Button } from "../../../components/button/button";
import { useLocation, useNavigate } from "react-router";
import { Modal } from "../../../components/modal/modal";
import { Input } from "../../../components/input/input";
import { HeaderRow } from "../../../components/row/headerRow";
import { Alert } from "../../../components/modal/alert";
import { optionsPlace, optionsType } from "../../../utils/constans";
import { parseListCompanyToOptions } from "../../../utils/meeting";
import { useMeetingForm } from "../../../hooks/useMeetingForm";


export const NewMessage = (): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const idMessage: { id: number } = location.state ? location.state : { id: -1 }
    const isEditMode = location.pathname.includes("edit");

    const {
        formState,
        updateState,
        listCompany,
        isOpenAlert,
        setIsOpenAlert,
        handleSaveMeeting,
        handleAgendaAdd,
        handleAgendaDelete,
        handleAgendaUpdate,
        updateTimeField
    } = useMeetingForm(idMessage.id, isEditMode);
    
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [checked, setChecked] = useState<boolean>(false);


    const handleExit = () => {
        navigate('/admin');
    }

    const handleTimeChangeFrom = (hours: number, minutes: number) => {
        updateTimeField('selectedTimeMeetingFrom', hours, minutes);
    };

    const handleTimeChangeTo = (hours: number, minutes: number) => {
        updateTimeField('selectedTimeMeetingTo', hours, minutes);
    };

    const handleTimeRegisterStartChange = (hours: number, minutes: number) => {
        updateTimeField('selectedTimeRegisterStart', hours, minutes);
    };

    const handleTimeRegisterEndChange = (hours: number, minutes: number) => {
        updateTimeField('selectedTimeRegisterEnd', hours, minutes);
    };

    const hadleTimeVotingStartChange = (hours: number, minutes: number) => {
        updateTimeField('selectedTimeVoting', hours, minutes);
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
                    <div className="flex items-center w-[355px] justify-between">
                        <div className="mr-[5px]">
                            Время регистрации с
                        </div>
                        <InputTime 
                            onTimeChange={handleTimeRegisterStartChange} 
                            initialHours={new Date(formState.selectedTimeRegisterStart).getHours()}
                            initialMinutes={new Date(formState.selectedTimeRegisterStart).getMinutes()}
                        />
                        <div>
                            до
                        </div>
                        <InputTime 
                            onTimeChange={handleTimeRegisterEndChange} 
                            initialHours={new Date(formState.selectedTimeRegisterEnd).getHours()}
                            initialMinutes={new Date(formState.selectedTimeRegisterEnd).getMinutes()}
                        />
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
                    <div className="flex items-center w-[355px] justify-between">
                        <div className="mr-[25px]">
                            Время собрания с
                        </div>
                        <InputTime 
                            onTimeChange={handleTimeChangeFrom} 
                            initialHours={new Date(formState.selectedTimeMeetingFrom).getHours()}
                            initialMinutes={new Date(formState.selectedTimeMeetingFrom).getMinutes()}
                        />
                        <div>
                            до
                        </div>
                        <InputTime 
                            onTimeChange={handleTimeChangeTo} 
                            initialHours={new Date(formState.selectedTimeMeetingTo).getHours()}
                            initialMinutes={new Date(formState.selectedTimeMeetingTo).getMinutes()}
                        />
                    </div>
                    <div className="flex items-center w-[374px] justify-between">
                        <div>
                            Дата начала подсчёта голосов:
                        </div>
                        <InputDate
                            value={formState.selectedDateVoting}
                            onChange={(e) => updateState('selectedDateVoting', e)}
                        />
                    </div>
                    <div className="flex items-center w-[355px] justify-between">
                        <div className="mr-[28px]">
                            Время начала подсчёта голосов:
                        </div>
                        <InputTime 
                            onTimeChange={hadleTimeVotingStartChange} 
                            initialHours={new Date(formState.selectedTimeVoting).getHours()}
                            initialMinutes={new Date(formState.selectedTimeVoting).getMinutes()}
                        />
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

                </div>
                Повестка дня:
                <div className="mt-7">
                    <HeaderRow />
                    {formState.agendas.map((agenda, index) =>
                        <Row
                            key={index + 1}
                            agenda={agenda}
                            index={index + 1}
                            onChange={handleAgendaUpdate}
                            onDelete={() => handleAgendaDelete(agenda.questionId)}
                        />)}
                    <Row
                        agenda={null}
                        index={formState.agendas.length + 1}
                        onChange={handleAgendaAdd}
                        onDelete={handleAgendaDelete}
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
                    <p>Все не сохранённые данные удалятся!</p>
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