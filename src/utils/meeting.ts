import { IAgendaDetails, IListCompany } from "../requests/interfaces";
import { IFormState, IMeetingUpdate } from "./interfaces";
import { Option } from "../components/select/select";

interface IAgendaFromServer {
    question_id: number;
    question: string;
    decision: string;
    cumulative: boolean;
    details?: IAgendaDetails[];
}

export const addTimedate = (date: string, time: Date): Date => {
    if (!(time instanceof Date)) {
        throw new Error("The 'time' parameter must be a Date object");
    }

    const newDate = new Date(date);
    newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return newDate;
};

export const getTimeFromString = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
};

export const mapMeetingCreateToFormStateEdit = (data: IMeetingUpdate): IFormState => {
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
        agendas: (data.agenda as unknown as IAgendaFromServer[]).map(item => ({
            questionId: item.question_id,
            question: item.question,
            decision: item.decision,
            cumulative: item.cumulative,
            details: item.details || []
        })),
        files: data.file,
        meeting_name: data.meeting_name,
        status: data.status,
        meeting_url: data.meeting_url,
    };
};

export const parseListCompanyToOptions = (companies: IListCompany[]): Option[] => {
    return companies.map(company => ({
        label: company.full_name,
        value: company.issuer_id
    }));
};