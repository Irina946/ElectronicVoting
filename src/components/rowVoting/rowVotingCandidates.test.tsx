import { render, screen, fireEvent } from '@testing-library/react'
import { RowVotingCandidates } from './rowVotingCandidates'
import { IAgenda } from '../../requests/interfaces'

describe('RowVotingCandidates', () => {
    const mockAgenda: IAgenda = {
        question_id: 1,
        question: 'Тестовый вопрос',
        decision: 'Тестовое решение',
        single_vote_per_shareholder: true,
        cumulative: false,
        seat_count: 1,
        details: [
            { detail_id: 1, detail_text: 'Деталь 1' },
            { detail_id: 2, detail_text: 'Деталь 2' }
        ]
    }

    const mockOnVoteChange = jest.fn()

    beforeEach(() => {
        mockOnVoteChange.mockClear()
    })

    it('отображает номер вопроса', () => {
        render(<RowVotingCandidates agenda={mockAgenda} onVoteChange={mockOnVoteChange} numberQuestion={1} />)
        const numberElement = screen.getByText('1')
        expect(numberElement).toBeInTheDocument()
    })

    it('отображает текст вопроса', () => {
        render(<RowVotingCandidates agenda={mockAgenda} onVoteChange={mockOnVoteChange} numberQuestion={1} />)
        const questionElements = screen.getAllByText((content, element) => {
            return element?.textContent?.includes('Тестовый вопрос') ?? false
        })
        expect(questionElements.length).toBeGreaterThan(0)
    })

    it('отображает текст решения', () => {
        render(<RowVotingCandidates agenda={mockAgenda} onVoteChange={mockOnVoteChange} numberQuestion={1} />)
        const decisionElements = screen.getAllByText('Решение: Тестовое решение')
        expect(decisionElements.length).toBeGreaterThan(0)
    })

    it('отображает детали голосования', () => {
        render(<RowVotingCandidates agenda={mockAgenda} onVoteChange={mockOnVoteChange} numberQuestion={1} />)
        const detailsElements = screen.getAllByText(/Деталь [12]/)
        expect(detailsElements.length).toBe(4)
        expect(detailsElements[0].textContent).toContain('Деталь 1')
        expect(detailsElements[1].textContent).toContain('Деталь 2')
    })

    it('отображает основные чекбоксы для голосования', () => {
        render(<RowVotingCandidates agenda={mockAgenda} onVoteChange={mockOnVoteChange} numberQuestion={1} />)
        const mainCheckboxes = screen.getAllByRole('checkbox').slice(0, 3)
        expect(mainCheckboxes.length).toBe(3)
    })

    it('вызывает onVoteChange при изменении основного чекбокса', () => {
        render(<RowVotingCandidates agenda={mockAgenda} onVoteChange={mockOnVoteChange} numberQuestion={1} />)
        const mainCheckboxes = screen.getAllByRole('checkbox').slice(0, 3)
        fireEvent.click(mainCheckboxes[0])
        expect(mockOnVoteChange).toHaveBeenCalled()
    })

    it('отображает чекбоксы для деталей при раскрытии', () => {
        render(<RowVotingCandidates agenda={mockAgenda} onVoteChange={mockOnVoteChange} numberQuestion={1} />)
        const expandButton = screen.getByRole('button')
        fireEvent.click(expandButton)
        const allCheckboxes = screen.getAllByRole('checkbox')
        expect(allCheckboxes.length).toBe(9) // 3 основных + 6 для деталей (3 для каждой детали)
    })
}) 