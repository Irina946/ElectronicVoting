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
    it('должен обрабатывать случай с "ВОЗДЕРЖАЛСЯ"', () => {
        const input = {
            1: "ВОЗДЕРЖАЛСЯ"
        };

        const result = transformToVoteDtls(input);

        expect(result.VoteInstrForAgndRsltn).toHaveLength(1);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr.QuestionId).toBe(1);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr).not.toHaveProperty('Against');
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr).not.toHaveProperty('For');
    });

    it('должен обрабатывать случай с "ПРОТИВ"', () => {
        const input = {
            1: "ПРОТИВ"
        };

        const result = transformToVoteDtls(input);

        expect(result.VoteInstrForAgndRsltn).toHaveLength(1);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr.QuestionId).toBe(1);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr.Against).toEqual({ Quantity: 1 });
    });

    it('должен обрабатывать случай с несколькими кандидатами', () => {
        const input = {
            1: {
                20: 10,
                21: 5,
                22: 3,
                23: 1
            }
        };

        const result = transformToVoteDtls(input);

        expect(result.VoteInstrForAgndRsltn).toHaveLength(1);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr.QuestionId).toBe(1);
        expect(result.VoteInstrForAgndRsltn[0].VoteInstr.For).toEqual({ Quantity: 1 });
    });
});

describe('formatDate', () => {
    it('должен форматировать дату на русском языке', () => {
        expect(formatDate('2024-03-15')).toBe('15 марта 2024 г.');
    });

    it('должен возвращать пустую строку для пустой даты', () => {
        const result = formatDate('');
        expect(result).toBe('');
    });
});

describe('formatDateWithTime', () => {
    it('должен форматировать дату и время на русском языке', () => {
        expect(formatDateWithTime('2024-03-15T14:30:00')).toBe('15 марта 2024 г. в 14:30');
    });

    it('должен возвращать пустую строку для пустой даты', () => {
        const result = formatDateWithTime('');
        expect(result).toBe('');
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
            },
            SummarizedVoteResults: [
                {
                    QuestionId: 1,
                    results: [
                        {
                            DetailId: 1,
                            For: 10,
                            Against: 0,
                            Abstain: 0
                        }
                    ]
                },
                {
                    QuestionId: 2,
                    results: [
                        {
                            DetailId: 1,
                            For: 0,
                            Against: 5,
                            Abstain: 0
                        }
                    ]
                }
            ]
        };

        const result = convertToQuestionWithVote(data);

        expect(result).toHaveLength(2);
        
        // Проверка первого вопроса
        expect(result[0].question_id).toBe(1);
        expect(result[0].question).toBe('Вопрос 1');
        expect(result[0].vote).toBeDefined();
        expect(result[0].vote).toHaveLength(1);
        expect(result[0].vote?.[0].For).toEqual({ Quantity: 10 });
        expect(result[0].vote?.[0].Against).toEqual({ Quantity: 0 });
        expect(result[0].vote?.[0].Abstain).toEqual({ Quantity: 0 });
        
        // Проверка второго вопроса
        expect(result[1].question_id).toBe(2);
        expect(result[1].question).toBe('Вопрос 2');
        expect(result[1].vote).toBeDefined();
        expect(result[1].vote).toHaveLength(1);
        expect(result[1].vote?.[0].For).toEqual({ Quantity: 0 });
        expect(result[1].vote?.[0].Against).toEqual({ Quantity: 5 });
        expect(result[1].vote?.[0].Abstain).toEqual({ Quantity: 0 });
    });

    it('должен обрабатывать случай без голосов', () => {
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
            SummarizedVoteResults: []
        };

        const result = convertToQuestionWithVote(data);

        expect(result).toHaveLength(1);
        expect(result[0].question_id).toBe(1);
        expect(result[0].question).toBe('Вопрос 1');
        expect(result[0].vote).toBeDefined();
        expect(result[0].vote).toHaveLength(1);
        expect(result[0].vote?.[0]).toEqual({
            QuestionId: 1,
            For: { Quantity: 0 },
            Against: { Quantity: 0 },
            Abstain: { Quantity: 0 }
        });
    });

    it('должен обрабатывать случай с несколькими результатами голосования для одного вопроса', () => {
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
                            For: 10,
                            Against: 5,
                            Abstain: 2
                        },
                        {
                            DetailId: 2,
                            For: 15,
                            Against: 3,
                            Abstain: 1
                        }
                    ]
                }
            ]
        };

        const result = convertToQuestionWithVote(data);

        expect(result).toHaveLength(1);
        expect(result[0].question_id).toBe(1);
        expect(result[0].question).toBe('Вопрос 1');
        expect(result[0].vote).toBeDefined();
        expect(result[0].vote).toHaveLength(2);
        
        // Проверка первого набора результатов
        expect(result[0].vote?.[0].For).toEqual({ Quantity: 10 });
        expect(result[0].vote?.[0].Against).toEqual({ Quantity: 5 });
        expect(result[0].vote?.[0].Abstain).toEqual({ Quantity: 2 });
        
        // Проверка второго набора результатов
        expect(result[0].vote?.[1].For).toEqual({ Quantity: 15 });
        expect(result[0].vote?.[1].Against).toEqual({ Quantity: 3 });
        expect(result[0].vote?.[1].Abstain).toEqual({ Quantity: 1 });
    });

    it('должен обрабатывать случай с воздержавшимися голосами', () => {
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
                            For: 0,
                            Against: 0,
                            Abstain: 20
                        }
                    ]
                }
            ]
        };

        const result = convertToQuestionWithVote(data);

        expect(result).toHaveLength(1);
        expect(result[0].question_id).toBe(1);
        expect(result[0].question).toBe('Вопрос 1');
        expect(result[0].vote).toBeDefined();
        expect(result[0].vote).toHaveLength(1);
        expect(result[0].vote?.[0].Abstain).toEqual({ Quantity: 20 });
        expect(result[0].vote?.[0].For).toEqual({ Quantity: 0 });
        expect(result[0].vote?.[0].Against).toEqual({ Quantity: 0 });
    });

    it('должен обрабатывать случай с пустыми результатами голосования', () => {
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
                            For: 0,
                            Against: 0,
                            Abstain: 0
                        }
                    ]
                }
            ]
        };

        const result = convertToQuestionWithVote(data);

        expect(result).toHaveLength(1);
        expect(result[0].question_id).toBe(1);
        expect(result[0].question).toBe('Вопрос 1');
        expect(result[0].vote).toBeDefined();
        expect(result[0].vote).toHaveLength(1);
        expect(result[0].vote?.[0].For).toEqual({ Quantity: 0 });
        expect(result[0].vote?.[0].Against).toEqual({ Quantity: 0 });
        expect(result[0].vote?.[0].Abstain).toEqual({ Quantity: 0 });
    });
}); 