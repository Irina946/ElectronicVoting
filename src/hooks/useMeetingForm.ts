import { useCallback, useEffect, useMemo, useState } from "react";
import { addTimedate, getTimeFromString, mapMeetingCreateToFormStateEdit } from "../utils/meeting";
import { IFormState } from "../utils/interfaces";
import { IAgendaCreate, IAgendaSent, IListCompany } from "../requests/interfaces";
import { getDraftForId, getListCompany, postMeetingCreate, putDraft } from "../requests/requests";

const defaultDate = new Date().toISOString().split("T")[0];
const defaultTime = getTimeFromString("14:00");

// Создаем начальное состояние формы вне компонента, чтобы избежать повторных созданий
const initialFormState: IFormState = {
    selectedType: { value: false, repeat: false },
    selectedForm: false,
    selectedIssuer: 0,
    selectedPlace: '',
    checkedEarlyRegistration: false,
    selectedDateAcceptance: defaultDate,
    selectedDateDefinition: defaultDate,
    selectedDateRegisterStart: defaultDate,
    selectedTimeRegisterStart: defaultTime,
    selectedTimeRegisterEnd: defaultTime,
    selectedDateMeeting: defaultDate,
    selectedTimeMeetingFrom: defaultTime,
    selectedTimeMeetingTo: defaultTime,
    selectedDateVoting: defaultDate,
    selectedTimeVoting: defaultTime,
    agendas: [],
    files: []
};

export const useMeetingForm = (idMessage: number, isEditMode: boolean) => {
    const [formState, setFormState] = useState<IFormState>(() => ({ ...initialFormState }));
    const [listCompany, setListCompany] = useState<IListCompany[]>([]);
    const [isOpenAlert, setIsOpenAlert] = useState(false);

    // Оптимизированное обновление состояния с useCallback
    const updateState = useCallback(<K extends keyof IFormState>(key: K, value: IFormState[K]) => {
        setFormState(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Обработчик сохранения встречи с useCallback
    const handleSaveMeeting = useCallback(async () => {
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
                closeout: addTimedate(formState.selectedDateRegisterStart, getTime(formState.selectedTimeRegisterEnd)),
                meeting_open: addTimedate(formState.selectedDateMeeting, getTime(formState.selectedTimeMeetingFrom)),
                meeting_close: addTimedate(formState.selectedDateMeeting, getTime(formState.selectedTimeMeetingTo)),
                early_registration: formState.checkedEarlyRegistration,
                agenda: formState.agendas.map((agenda): IAgendaSent => ({
                    question: agenda.question,
                    decision: agenda.decision,
                    cumulative: agenda.cumulative,
                    details: agenda.details
                })),
                file: formState.files,
                meeting_date: formState.selectedDateMeeting,
                vote_counting: addTimedate(formState.selectedDateVoting, getTime(formState.selectedTimeVoting)),
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
    }, [formState, idMessage, isEditMode]);

    // Обработчики для работы с повесткой с useCallback
    const handleAgendaAdd = useCallback((question: IAgendaCreate) => {
        setFormState(prev => ({
            ...prev,
            agendas: [...prev.agendas, { ...question }]
        }));
    }, []);

    const handleAgendaDelete = useCallback((uniqueId: number) => {
        setFormState(prev => ({
            ...prev,
            agendas: prev.agendas.filter(a => a.questionId !== uniqueId)
        }));
    }, []);

    const handleAgendaUpdate = useCallback((updated: IAgendaCreate, index: number) => {
        setFormState(prev => {
            const updatedAgendas = [...prev.agendas];
            updatedAgendas[index] = updated;
            return {
                ...prev,
                agendas: updatedAgendas
            };
        });
    }, []);

    const updateTimeField = useCallback((key: keyof IFormState, hours: number, minutes: number) => {
        setFormState(prev => {
            const newDate = new Date(prev[key] as Date);
            newDate.setHours(hours, minutes, 0, 0);
            return {
                ...prev,
                [key]: newDate
            };
        });
    }, []);

    // Загрузка данных при монтировании компонента
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
                    const newState = mapMeetingCreateToFormStateEdit(meeting);
                    setFormState(newState);
                } catch (err) {
                    console.error("Ошибка при получении собрания:", err);
                }
            }
        };

        fetchCompanies();
        fetchMeeting();
    }, [idMessage, isEditMode]);

    // Используем useMemo для возвращаемого объекта, чтобы избежать перерисовок
    return useMemo(() => ({
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
    }), [
        formState,
        updateState,
        listCompany,
        isOpenAlert,
        handleSaveMeeting,
        handleAgendaAdd,
        handleAgendaDelete,
        handleAgendaUpdate,
        updateTimeField
    ]);
};