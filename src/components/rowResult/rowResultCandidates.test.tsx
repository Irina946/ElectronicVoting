import { render, screen } from '@testing-library/react'
import { RowResultCandidates } from './rowResultCandidates'
import { IQuestionWithVote } from '../../pages/results/results'

describe('RowResultCandidates', () => {
    const mockQuestion: IQuestionWithVote = {
        question_id: 1,
        question: 'Тестовый вопрос',
        decision: 'Тестовое решение',
        single_vote_per_shareholder: true,
        cumulative: false,
        seat_count: 1,
        details: [
            { detail_id: 1, detail_text: 'Деталь 1' },
            { detail_id: 2, detail_text: 'Деталь 2' }
        ],
        vote: [
            {
                QuestionId: 1,
                DetailId: 1,
                For: { Quantity: 10 },
                Against: { Quantity: 5 },
                Abstain: { Quantity: 2 }
            },
            {
                QuestionId: 1,
                DetailId: 2,
                For: { Quantity: 15 },
                Against: { Quantity: 3 },
                Abstain: { Quantity: 1 }
            }
        ]
    }

    it('отображает номер вопроса', () => {
        render(<RowResultCandidates question={mockQuestion} number={1} />)
        const numberCell = screen.getByText('1', { selector: '.px-3\\.5' })
        expect(numberCell).toBeInTheDocument()
    })

    it('отображает текст вопроса', () => {
        render(<RowResultCandidates question={mockQuestion} number={1} />)
        expect(screen.getByText('Вопрос: Тестовый вопрос')).toBeInTheDocument()
    })

    it('отображает текст решения', () => {
        render(<RowResultCandidates question={mockQuestion} number={1} />)
        expect(screen.getByText('Решение: Тестовое решение')).toBeInTheDocument()
    })

    it('отображает детали голосования', () => {
        render(<RowResultCandidates question={mockQuestion} number={1} />)
        expect(screen.getByText('Деталь 1')).toBeInTheDocument()
        expect(screen.getByText('Деталь 2')).toBeInTheDocument()
    })

    it('отображает результаты голосования', () => {
        const mockQuestion: IQuestionWithVote = {
            question_id: 1,
            question: 'Тестовый вопрос',
            decision: 'Тестовое решение',
            single_vote_per_shareholder: true,
            cumulative: false,
            seat_count: 1,
            details: [{ detail_id: 1, detail_text: 'Деталь 1' }],
            vote: [
                { 
                    QuestionId: 1,
                    DetailId: 1,
                    For: { Quantity: 100 },
                    Against: { Quantity: 50 },
                    Abstain: { Quantity: 25 }
                }
            ]
        }
        render(<RowResultCandidates question={mockQuestion} number={1} />)
        expect(screen.getByText('100')).toBeInTheDocument()
        expect(screen.getByText('50')).toBeInTheDocument()
        expect(screen.getByText('25')).toBeInTheDocument()
    })

    it('не отображает результаты голосования, если vote не определен', () => {
        const questionWithoutVote = { ...mockQuestion, vote: undefined }
        render(<RowResultCandidates question={questionWithoutVote} number={1} />)
        const votes = screen.queryAllByText(/^(10|5|2|15|3|1)$/).filter(element => {
            const parent = element.parentElement
            return parent && parent.className.includes('flex') && 
                   parent.className.includes('items-center') && 
                   parent.className.includes('justify-center') &&
                   !parent.className.includes('border-r-[0.5px]')
        })
        expect(votes).toHaveLength(0)
    })
}) 