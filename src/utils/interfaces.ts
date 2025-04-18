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