import { IAgendaCreate, IMeetingCreate } from "../requests/interfaces";

export interface IMeetingUpdate extends IMeetingCreate {
    meeting_name: string | null;
    status: number;
    meeting_url: string | null;
}

export interface IFormState {
    selectedType: { value: boolean | number; repeat?: boolean };
    selectedForm: boolean | number;
    selectedIssuer?: number | boolean;
    selectedPlace: string;
    checkedEarlyRegistration: boolean;
    selectedDateAcceptance: string;
    selectedDateDefinition: string;
    selectedDateRegisterStart: string;
    selectedTimeRegisterStart: Date;
    selectedTimeRegisterEnd: Date;
    selectedDateMeeting: string;
    selectedTimeMeetingFrom: Date;
    selectedTimeMeetingTo: Date;
    selectedDateVoting: string;
    selectedTimeVoting: Date;
    agendas: IAgendaCreate[];
    files: File[];
    meeting_name?: string | null;
    status?: number;
    meeting_url?: string | null;
}