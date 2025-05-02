import { render, screen } from '@testing-library/react'
import { MeetingInfo } from './meetingInfo'
import { IMeeting } from '../../requests/interfaces'

describe('MeetingInfo', () => {
    const mockMeeting: IMeeting = {
        meeting_id: 1,
        meeting_name: 'Тестовое собрание',
        meeting_date: '2024-04-17',
        meeting_open: '2024-04-17T10:00:00',
        meeting_close: '2024-04-17T18:00:00',
        meeting_location: 'Тестовый адрес',
        meeting_url: 'https://example.com',
        record_date: '2024-04-01',
        deadline_date: '2024-04-16',
        decision_date: '2024-04-17',
        checkin: '2024-04-17T09:00:00',
        closeout: '2024-04-17T18:00:00',
        vote_counting: '2024-04-17T18:00:00',
        inter_or_extra_mural: true,
        early_registration: true,
        status: 1,
        annual_or_unscheduled: true,
        first_or_repeated: true,
        issuer: {
            short_name: 'Тестовая компания',
            address: 'Тестовый адрес'
        },
        agenda: [
            { question_id: 1, question: 'Тестовый вопрос 1', decision: 'Тестовое решение 1', single_vote_per_shareholder: true, cumulative: false, seat_count: 1, details: [] },
            { question_id: 2, question: 'Тестовый вопрос 2', decision: 'Тестовое решение 2', single_vote_per_shareholder: true, cumulative: false, seat_count: 1, details: [] }
        ]
    }

    const mockNameCompany = 'Тестовая компания'

    it('отображает заголовок', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        expect(screen.getByText('Сообщение')).toBeInTheDocument()
    })

    it('отображает название компании', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        const companyElements = screen.getAllByText((content, element) => {
            return element?.textContent?.includes('Тестовая компания') ?? false
        })
        expect(companyElements.length).toBeGreaterThan(0)
    })

    it('отображает дату и время проведения собрания', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        const dateElement = screen.getByText((content, element) => {
            return element?.textContent === '17 апреля 2024 г. в 10:00'
        })
        expect(dateElement).toBeInTheDocument()
    })

    it('отображает место проведения собрания', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        const locationElement = screen.getByText((content, element) => {
            return element?.textContent === 'Тестовый адрес'
        })
        expect(locationElement).toBeInTheDocument()
    })

    it('отображает дату определения участников', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        const dateElement = screen.getByText((content, element) => {
            return element?.textContent === '1 апреля 2024 г.'
        })
        expect(dateElement).toBeInTheDocument()
    })

    it('отображает дату и время окончания приёма бюллетеней', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        const dateElement = screen.getByText((content, element) => {
            return element?.textContent === '16 апреля 2024 г. в 05:00'
        })
        expect(dateElement).toBeInTheDocument()
    })

    it('отображает повестку дня', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        expect(screen.getByText('Тестовый вопрос 1')).toBeInTheDocument()
        expect(screen.getByText('Тестовый вопрос 2')).toBeInTheDocument()
    })

    it('отображает ссылку на материалы собрания', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        const linkElements = screen.getAllByText((content, element) => {
            return element?.textContent === 'Материалы собрания'
        })
        expect(linkElements.length).toBeGreaterThan(0)
    })

    it('отображает информацию о Совете директоров', () => {
        render(<MeetingInfo informationMeeting={mockMeeting} nameCompany={mockNameCompany} />)
        const directorElements = screen.getAllByText((content, element) => {
            return element?.textContent?.includes('Совет директоров АО') ?? false
        })
        expect(directorElements.length).toBeGreaterThan(0)
    })

    it('корректно обрабатывает отсутствие данных', () => {
        render(<MeetingInfo />)
        expect(screen.queryByText('Сообщение')).toBeNull()
    })
}) 