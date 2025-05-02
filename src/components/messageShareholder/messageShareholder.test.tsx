import { render, screen } from '@testing-library/react'
import { MessageShareholder } from './messageShareholder'
import { IMail } from '../../requests/interfaces'

describe('MessageShareholder', () => {
    const mockMessage: IMail = {
        meeting_id: 1,
        meeting_date: '2024-04-17',
        status: 1,
        is_draft: false,
        updated_at: '2024-04-17',
        sent_at: '2024-04-17',
        created_by: {
            id: 1,
            email: 'test@example.com',
            avatar: null
        },
        issuer: {
            short_name: 'АО Тестовая компания'
        },
        annual_or_unscheduled: true,
        first_or_repeated: true
    }

    const handleClick = jest.fn()

    it('отображает корректную дату', () => {
        render(<MessageShareholder messageShareholder={mockMessage} onClick={handleClick} />)
        expect(screen.getByText('17.04.2024')).toBeInTheDocument()
    })

    it('отображает email отправителя', () => {
        render(<MessageShareholder messageShareholder={mockMessage} onClick={handleClick} />)
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('отображает корректный текст сообщения для годового собрания', () => {
        render(<MessageShareholder messageShareholder={mockMessage} onClick={handleClick} />)
        const messageElement = screen.getByText(/Сообщение о проведении Годового/)
        expect(messageElement).toBeInTheDocument()
        expect(messageElement.textContent).toMatch(/Тестовая компа/)
    })

    it('отображает корректный текст сообщения для внеочередного собрания', () => {
        const unscheduledMessage = { ...mockMessage, annual_or_unscheduled: false }
        render(<MessageShareholder messageShareholder={unscheduledMessage} onClick={handleClick} />)
        const messageElement = screen.getByText(/Сообщение о проведении Внеочередного/)
        expect(messageElement).toBeInTheDocument()
        expect(messageElement.textContent).toContain('Тестовая')
    })

    it('отображает корректный текст для повторного собрания', () => {
        const repeatedMessage = { ...mockMessage, first_or_repeated: false }
        render(<MessageShareholder messageShareholder={repeatedMessage} onClick={handleClick} />)
        const messageElement = screen.getByText(/Сообщение о проведении Годового повторного/)
        expect(messageElement).toBeInTheDocument()
        expect(messageElement.textContent).toContain('Тест')
    })

    it('вызывает onClick при клике', () => {
        render(<MessageShareholder messageShareholder={mockMessage} onClick={handleClick} />)
        const messageElement = screen.getByText(/Сообщение о проведении Годового/)
        messageElement.click()
        expect(handleClick).toHaveBeenCalled()
    })
}) 