import { IMeetingUpdate } from "../utils/interfaces"

export interface IMail {
    meeting_id: number,
    issuer: {
        short_name: string
    },
    meeting_date: string,
    status: number,
    is_draft: boolean,
    first_or_repeated: boolean,
    annual_or_unscheduled: boolean,
    updated_at: string,
    created_by: {
        id: number,
        email: string,
        avatar: null
    } | null,
    sent_at: string | null
}

export interface IDetailsForAgneda {
    detail_id: number,
    detail_text: string
}

export interface IAgenda {
    question_id: number,
    question: string,
    decision: string,
    single_vote_per_shareholder: boolean,
    cumulative: boolean,
    seat_count: number,
    details: IDetailsForAgneda[]
}

export interface IMeeting {
    meeting_id: number,
    meeting_name: string,
    issuer: {
        short_name: string,
        address: string
    },
    meeting_location: string,
    meeting_date: string,
    decision_date: string,
    deadline_date: string,
    checkin: string,
    closeout: string,
    meeting_open: string,
    meeting_close: string,
    vote_counting: string,
    first_or_repeated: boolean,
    record_date: string,
    annual_or_unscheduled: boolean,
    inter_or_extra_mural: boolean,
    early_registration: boolean,
    meeting_url: null | string,
    status: number,
    agenda: IAgenda[],
    is_registered?: boolean
}

interface IVoteInstrUser {
    Quantity: number;
    QuestionId: number;
    DetailId?: number; // Это поле может быть необязательным, если оно не всегда присутствует
}

interface IVoteDtls {
    VoteInstrForAgndRsltn: IVoteInstrUser[];
}

export interface IMeetingUsers extends IMeeting {
    vote_count: {
        VoteDtls: IVoteDtls
    }
}


export interface IUsersInMeeting {
    account_id: number,
    account_fullname: string
}

export interface IAccauntsInMeeting {
    meeting_id: number,
    accounts: IUsersInMeeting[]
}

export interface IAgendaDetails {
    detail_text: string
}


export interface IAgendaCreate {
    questionId: number,
    question: string,
    decision: string,
    cumulative: boolean,
    details?: IAgendaDetails[],
}

export interface IMeetingCreate {
    issuer: number,
    meeting_location: string,
    decision_date: string,
    record_date: string,
    meeting_date: string,
    deadline_date: string,
    checkin: Date,
    closeout: Date,
    meeting_open: Date,
    meeting_close: Date,
    vote_counting?: Date,
    annual_or_unscheduled: boolean,
    inter_or_extra_mural: boolean,
    first_or_repeated: boolean,
    early_registration: boolean,
    agenda: IAgendaCreate[],
    file: File[]
}

export interface IPutDrafts extends IMeetingUpdate {
    meeting_id: number
}

export interface IGetResults {
    meeting_id: number,
    account_id: number
}

export interface IVoteInstr {
    For?: {
        Quantity: number
    },
    Against?: {
        Quantity: number
    },
    Abstain?: {
        Quantity: number
    }
    QuestionId: number,
    DetailId?: number
}

export interface VoteInstr {
    VoteInstr: IVoteInstr
}

export interface IVote {
    VoteDtls: {
        VoteInstrForAgndRsltn: VoteInstr[],
    }
}

export interface IDataResults {
    meeting_id: number,
    meeting_name: string,
    deadline_date: string,
    meeting_close: Date,
    agenda: IAgenda[]
}

export interface IResultsMeeting {
    account_id: number,
    data: IDataResults,
    votes: IVote,
}

export interface IVoteResult {
    DetailId: number | null;
    For: number;
    Against: number;
    Abstain: number;
}

export interface ISummarizedVoteResult {
    QuestionId: number;
    results: IVoteResult[];
}

export interface IAllResultsMeeting {
    account_id: number,
    data: IDataResults,
    SummarizedVoteResults: ISummarizedVoteResult[]
}

export interface IListCompany {
    issuer_id: number,
    full_name: string
}

export interface Against {
    Quantity: number;
}

export interface For {
    Quantity: number;
}

export interface VoteInstrRes {
    Against?: Against; // Используем необязательное поле для Against
    For?: For;         // Используем необязательное поле для For
    DetailId?: number;  // Используем необязательное поле для DetailId
    QuestionId: number;
}

export interface VoteInstrForAgndRsltn {
    VoteInstr: VoteInstrRes;
}

export interface VoteDtls {
    VoteInstrForAgndRsltn: VoteInstrForAgndRsltn[];
}

