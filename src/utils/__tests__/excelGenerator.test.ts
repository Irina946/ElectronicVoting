import { generateExcelFile } from '../excelGenerator';
import { IQuestionWithVote } from '../../pages/results/results';
import ExcelJS from 'exceljs';

// Мокаем ExcelJS
jest.mock('exceljs', () => {
    return {
        Workbook: jest.fn().mockImplementation(() => ({
            addWorksheet: jest.fn().mockReturnValue({
                columns: [],
                getRow: jest.fn().mockReturnValue({
                    getCell: jest.fn().mockReturnValue({
                        value: '',
                        font: {},
                        border: {},
                        alignment: {}
                    })
                }),
                eachRow: jest.fn()
            }),
            xlsx: {
                writeBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0))
            }
        }))
    };
});

// Мокаем window.URL и document.createElement
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();
document.createElement = jest.fn(() => ({
    click: jest.fn(),
    href: '',
    download: '',
})) as jest.Mock;

describe('generateExcelFile', () => {
    const mockData: IQuestionWithVote[] = [
        {
            question_id: 1,
            question: 'Тестовый вопрос 1',
            decision: 'Тестовое решение 1',
            single_vote_per_shareholder: true,
            cumulative: false,
            seat_count: 1,
            vote: [
                {
                    QuestionId: 1,
                    For: { Quantity: 10 },
                    Against: { Quantity: 5 },
                    Abstain: { Quantity: 2 }
                }
            ],
            details: [
                {
                    detail_id: 1,
                    detail_text: 'Кандидат 1'
                }
            ]
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('должен создавать Excel файл с правильной структурой', async () => {
        await generateExcelFile(mockData);

        // Проверяем создание рабочей книги
        expect(ExcelJS.Workbook).toHaveBeenCalled();
        
        // Проверяем создание URL
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        
        // Проверяем создание ссылки
        expect(document.createElement).toHaveBeenCalledWith('a');
        
        // Проверяем освобождение URL
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('должен обрабатывать данные без голосов', async () => {
        const dataWithoutVotes: IQuestionWithVote[] = [
            {
                question_id: 2,
                question: 'Тестовый вопрос 2',
                decision: 'Тестовое решение 2',
                single_vote_per_shareholder: true,
                cumulative: false,
                seat_count: 1,
                vote: [],
                details: []
            }
        ];

        await generateExcelFile(dataWithoutVotes);

        expect(ExcelJS.Workbook).toHaveBeenCalled();
        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('должен обрабатывать данные с пустыми значениями голосов', async () => {
        const dataWithEmptyVotes: IQuestionWithVote[] = [
            {
                question_id: 3,
                question: 'Тестовый вопрос 3',
                decision: 'Тестовое решение 3',
                single_vote_per_shareholder: true,
                cumulative: false,
                seat_count: 1,
                vote: [
                    {
                        QuestionId: 3,
                        For: { Quantity: 0 },
                        Against: { Quantity: 0 },
                        Abstain: { Quantity: 0 }
                    }
                ],
                details: []
            }
        ];

        await generateExcelFile(dataWithEmptyVotes);

        expect(ExcelJS.Workbook).toHaveBeenCalled();
        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('должен обрабатывать данные с несколькими кандидатами', async () => {
        const dataWithMultipleCandidates: IQuestionWithVote[] = [
            {
                question_id: 3,
                question: 'Тестовый вопрос 3',
                decision: 'Тестовое решение 3',
                single_vote_per_shareholder: true,
                cumulative: false,
                seat_count: 2,
                vote: [
                    {
                        QuestionId: 3,
                        For: { Quantity: 15 },
                        Against: { Quantity: 3 },
                        Abstain: { Quantity: 1 }
                    },
                    {
                        QuestionId: 3,
                        For: { Quantity: 12 },
                        Against: { Quantity: 5 },
                        Abstain: { Quantity: 2 }
                    }
                ],
                details: [
                    {
                        detail_id: 1,
                        detail_text: 'Кандидат 1'
                    },
                    {
                        detail_id: 2,
                        detail_text: 'Кандидат 2'
                    }
                ]
            }
        ];

        await generateExcelFile(dataWithMultipleCandidates);

        expect(ExcelJS.Workbook).toHaveBeenCalled();
        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('должен обрабатывать данные с отсутствующими значениями голосов', async () => {
        const dataWithMissingVotes: IQuestionWithVote[] = [
            {
                question_id: 4,
                question: 'Тестовый вопрос 4',
                decision: 'Тестовое решение 4',
                single_vote_per_shareholder: true,
                cumulative: false,
                seat_count: 1,
                vote: [
                    {
                        QuestionId: 4,
                        For: { Quantity: 20 },
                        Against: undefined,
                        Abstain: undefined
                    }
                ],
                details: []
            }
        ];

        await generateExcelFile(dataWithMissingVotes);

        expect(ExcelJS.Workbook).toHaveBeenCalled();
        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('должен обрабатывать ошибку при генерации файла', async () => {
        const mockError = new Error('Ошибка генерации файла');
        (ExcelJS.Workbook as jest.Mock).mockImplementationOnce(() => {
            throw mockError;
        });

        await expect(generateExcelFile(mockData)).rejects.toThrow('Ошибка генерации файла');
    });
}); 