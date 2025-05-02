import { IQuestionWithVote } from "../pages/results/results";
import { VoteDtls, VoteInstrRes, VoteInstrForAgndRsltn, IDataResults, IVote, IVoteInstr, IAllResultsMeeting } from "../requests/interfaces";

export const formatedDate = (date: string): string => {
    const arrayDate = date.split('-')
    return `${arrayDate[2]}.${arrayDate[1]}.${arrayDate[0]}`
}

export function transformToVoteDtls(
    input: { [key: number]: string | { [candidate: number]: string | number } }
): VoteDtls {
    const voteInstrForAgndRsltn: VoteInstrForAgndRsltn[] = [];

    for (const key in input) {
        const questionId = Number(key);
        const value = input[key];

        const voteInstr: VoteInstrRes = { QuestionId: questionId };

        if (typeof value === "string") {
            // Если значение строка, то это, возможно, статус ("ВОЗДЕРЖАЛСЯ", "ПРОТИВ", и т.д.)
            if (value === "ВОЗДЕРЖАЛСЯ") {
                // Можно добавить логику для этого случая, если нужно
            } else if (value === "ПРОТИВ") {
                voteInstr.Against = { Quantity: 1 }; // Например, это может означать 1 голос против
            }
        } else if (typeof value === "object") {
            // Если значение - объект, то это голосование по кандидатам
            const voteData = value as { [candidate: number]: string | number };

            if (voteData[20] !== undefined) {
                voteInstr.For = { Quantity: Number(voteData[20]) };
            }
            if (voteData[21] !== undefined) {
                voteInstr.For = { Quantity: Number(voteData[21]) };
            }
            if (voteData[22] !== undefined) {
                voteInstr.For = { Quantity: Number(voteData[22]) };
            }
            if (voteData[23] !== undefined) {
                voteInstr.For = { Quantity: Number(voteData[23]) };
            }
        }

        voteInstrForAgndRsltn.push({ VoteInstr: voteInstr });
    }

    return { VoteInstrForAgndRsltn: voteInstrForAgndRsltn };
}

export const formatDate = (dateString: string): string => {
    if (dateString === '') return ''
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

export const formatDateWithTime = (dateString: string): string => {
    if (dateString === '') return ''
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

export const getNameCompany = (nameCompany: string): string => {
    return (nameCompany.slice(0, 2) === 'АО'
    ? nameCompany.slice(3)
    : nameCompany)
}

export function mergeQuestionsWithVotes(dataResults: IDataResults, votes: IVote): IQuestionWithVote[] {
    const voteMap = new Map<number, IVoteInstr[]>(); // Сохраняем все голоса по `question_id`

    votes.VoteDtls.VoteInstrForAgndRsltn.forEach(voteWrapper => {
        const voteInstr = voteWrapper.VoteInstr;
        if (!voteInstr) return;

        const { QuestionId } = voteInstr;

        if (!voteMap.has(QuestionId)) {
            voteMap.set(QuestionId, []);
        }
        voteMap.get(QuestionId)?.push(voteInstr);
    });

    return dataResults.agenda.map(question => ({
        ...question,
        vote: voteMap.get(question.question_id) || undefined
    }));
}

export function convertToQuestionWithVote(data: IAllResultsMeeting): IQuestionWithVote[] {
    const { data: meetingData, SummarizedVoteResults } = data;

    // Создаем карту голосований по QuestionId
    const voteMap = new Map<number, IVoteInstr[]>();

    SummarizedVoteResults.forEach(({ QuestionId, results }) => {
        const voteInstrs: IVoteInstr[] = results.map(result => ({
            QuestionId,
            DetailId: result.DetailId ?? undefined,
            For: result.For ? { Quantity: result.For } : { Quantity: 0 },
            Against: result.Against ? { Quantity: result.Against } : { Quantity: 0 },
            Abstain: result.Abstain ? { Quantity: result.Abstain } : { Quantity: 0 },
        }));
        voteMap.set(QuestionId, voteInstrs);
    });

    // Преобразуем каждый пункт повестки
    return meetingData.agenda.map(agendaItem => ({
        ...agendaItem,
        vote: voteMap.get(agendaItem.question_id) || [{
            QuestionId: agendaItem.question_id,
            For: { Quantity: 0 },
            Against: { Quantity: 0 },
            Abstain: { Quantity: 0 }
        }],
    }));
}
