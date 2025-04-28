import { 
    formatedDate, 
    transformToVoteDtls, 
    formatDate, 
    formatDateWithTime, 
    getNameCompany, 
    mergeQuestionsWithVotes,
    convertToQuestionWithVote
} from './functions';
import { IDataResults, IVote, IAllResultsMeeting } from '../requests/interfaces';

describe('formatedDate', () => {
    it('должен правильно форматировать дату', () => {
        expect(formatedDate('2024-03-15')).toBe('15.03.2024');
    });
});

describe('transformToVoteDtls', () => {
    it('должен преобразовывать голосование "ПРОТИВ"', () => {
        const input = {
            1: "ПРОТИВ"
        };
        const result = transformToVoteDtls(input);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr.Against?.Quantity).toBe(1);
    });

    it('должен преобразовывать голосование за кандидата', () => {
        const input = {
            1: { 20: 5 }
        };
        const result = transformToVoteDtls(input);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr.For?.Quantity).toBe(5);
    });
});

describe('formatDate', () => {
    it('должен форматировать дату на русском языке', () => {
        expect(formatDate('2024-03-15')).toBe('15 марта 2024 г.');
    });

    it('должен возвращать пустую строку для пустой даты', () => {
        expect(formatDate('')).toBe('');
    });
});

describe('formatDateWithTime', () => {
    it('должен форматировать дату и время на русском языке', () => {
        expect(formatDateWithTime('2024-03-15T14:30:00')).toBe('15 марта 2024 г. в 14:30');
    });

    it('должен возвращать пустую строку для пустой даты', () => {
        expect(formatDateWithTime('')).toBe('');
    });
});

describe('getNameCompany', () => {
    it('должен удалять "АО" из начала названия', () => {
        expect(getNameCompany('АО Рога и Копыта')).toBe('Рога и Копыта');
    });

    it('должен оставлять название без изменений, если оно не начинается с "АО"', () => {
        expect(getNameCompany('Рога и Копыта')).toBe('Рога и Копыта');
    });
});

describe('mergeQuestionsWithVotes', () => {
    it('должен объединять вопросы с голосами', () => {
        const dataResults: IDataResults = {
            meeting_id: 1,
            meeting_name: 'Тестовое собрание',
            deadline_date: '2024-03-15',
            meeting_close: new Date('2024-03-15'),
            agenda: [
                { 
                    question_id: 1, 
                    question: 'Вопрос 1',
                    decision: '',
                    single_vote_per_shareholder: false,
                    cumulative: false,
                    seat_count: 0,
                    details: []
                },
                { 
                    question_id: 2, 
                    question: 'Вопрос 2',
                    decision: '',
                    single_vote_per_shareholder: false,
                    cumulative: false,
                    seat_count: 0,
                    details: []
                }
            ]
        };

        const votes: IVote = {
            VoteDtls: {
                VoteInstrForAgndRsltn: [
                    {
                        VoteInstr: {
                            QuestionId: 1,
                            For: { Quantity: 5 }
                        }
                    }
                ]
            }
        };

        const result = mergeQuestionsWithVotes(dataResults, votes);
        expect(result[0].vote?.[0].For?.Quantity).toBe(5);
        expect(result[1].vote).toBeUndefined();
    });
});

describe('convertToQuestionWithVote', () => {
    it('должен преобразовывать данные собрания в вопросы с голосами', () => {
        const data: IAllResultsMeeting = {
            account_id: 1,
            data: {
                meeting_id: 1,
                meeting_name: 'Тестовое собрание',
                deadline_date: '2024-03-15',
                meeting_close: new Date('2024-03-15'),
                agenda: [
                    { 
                        question_id: 1, 
                        question: 'Вопрос 1',
                        decision: '',
                        single_vote_per_shareholder: false,
                        cumulative: false,
                        seat_count: 0,
                        details: []
                    }
                ]
            },
            SummarizedVoteResults: [
                {
                    QuestionId: 1,
                    results: [
                        {
                            DetailId: 1,
                            For: 5,
                            Against: 2,
                            Abstain: 1
                        }
                    ]
                }
            ]
        };

        const result = convertToQuestionWithVote(data);
        expect(result[0].vote?.[0].For?.Quantity).toBe(5);
        expect(result[0].vote?.[0].Against?.Quantity).toBe(2);
        expect(result[0].vote?.[0].Abstain?.Quantity).toBe(1);
    });
}); 