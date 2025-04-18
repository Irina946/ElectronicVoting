import { useEffect, useState } from "react";
import { addTimedate, getTimeFromString, mapMeetingCreateToFormStateEdit } from "../utils/meeting";
import { IFormState } from "../utils/interfaces";
import { IAgendaCreate, IListCompany } from "../requests/interfaces";
import { getDraftForId, getListCompany, postMeetingCreate, putDraft } from "../requests/requests";

const defaultDate = new Date().toISOString().split("T")[0];
const defaultTime = getTimeFromString("14:00");

export const useMeetingForm = (idMessage: number, isEditMode: boolean) => {
    const [formState, setFormState] = useState<IFormState>({
        selectedType: { value: false, repeat: false },
        selectedForm: false,
        selectedIssuer: undefined,
        selectedPlace: '',
        checkedEarlyRegistration: false,
        selectedDateAcceptance: defaultDate,
        selectedDateDefinition: defaultDate,
        selectedDateRegisterStart: defaultDate,
        selectedDateRegisterEnd: defaultDate,
        selectedTimeRegisterStart: defaultTime,
        selectedTimeRegisterEnd: defaultTime,
        selectedDateMeeting: defaultDate,
        selectedTimeMeetingFrom: defaultTime,
        selectedTimeMeetingTo: defaultTime,
        selectedDateReceivingBallotsStart: defaultDate,
        selectedDateReceivingBallotsEnd: defaultDate,
        selectedTimeReceivingBallotsStart: defaultTime,
        selectedTimeReceivingBallotsEnd: defaultTime,
        agendas: [],
        files: []
    });

    const [listCompany, setListCompany] = useState<IListCompany[]>([]);
    const [isOpenAlert, setIsOpenAlert] = useState(false);

    const updateState = <K extends keyof IFormState>(key: K, value: IFormState[K]) => {
        setFormState(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveMeeting = async () => {
        const getTime = (time: Date | string): Date =>
            typeof time === "string" ? new Date(time) : time;

        try {
            const payload = {
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
                vote_counting: addTimedate(formState.selectedDateReceivingBallotsStart, getTime(formState.selectedTimeReceivingBallotsStart)),
                meeting_name: formState.meeting_name || "",
                meeting_url: formState.meeting_url || "",
                status: formState.status || 1
            };

            if (isEditMode) {
                await putDraft(idMessage, { ...payload, meeting_id: idMessage });
            } else {
                await postMeetingCreate(payload);
            }

            setIsOpenAlert(true);
        } catch (err) {
            console.error("Ошибка при сохранении встречи:", err);
        }
    };

    const handleAgendaAdd = (question: IAgendaCreate) => {
        updateState("agendas", [...formState.agendas, { ...question }]);
    };

    const handleAgendaDelete = (uniqueId: number) => {
        updateState("agendas", formState.agendas.filter(a => a.questionId !== uniqueId));
    };

    const handleAgendaUpdate = (updated: IAgendaCreate, index: number) => {
        const updatedAgendas = [...formState.agendas];
        updatedAgendas[index] = updated;
        updateState("agendas", updatedAgendas);
    };

    const updateTimeField = (key: keyof IFormState, hours: number, minutes: number) => {
        const newDate = new Date(formState[key] as Date);
        newDate.setHours(hours, minutes, 0, 0);
        updateState(key, newDate);
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const companies = await getListCompany();
                setListCompany(companies);
            } catch (err) {
                console.error("Ошибка при получении компаний:", err);
            }
        };

        const fetchMeeting = async () => {
            if (isEditMode && idMessage !== -1) {
                try {
                    const meeting = await getDraftForId(idMessage);
                    setFormState(mapMeetingCreateToFormStateEdit(meeting));
                } catch (err) {
                    console.error("Ошибка при получении собрания:", err);
                }
            }
        };

        fetchCompanies();
        fetchMeeting();
    }, [idMessage, isEditMode]);

    return {
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
    };
};