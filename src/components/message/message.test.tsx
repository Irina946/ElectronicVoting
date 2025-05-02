import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Message } from './message';
import { Alert } from '../modal/alert';
import { putMeeting } from '../../requests/requests';
import { IMail } from '../../requests/interfaces';
import { AxiosError, AxiosHeaders } from 'axios';

// Мокаем компоненты и функции
jest.mock('../modal/alert');
jest.mock('../../requests/requests');

const mockData: IMail = {
    meeting_id: 123,
    issuer: {
        short_name: 'АО Компания'
    },
    meeting_date: '2024-01-01',
    status: 1,
    is_draft: true,
    first_or_repeated: true,
    annual_or_unscheduled: true,
    updated_at: '2024-01-01',
    created_by: {
        id: 1,
        email: 'test@example.com',
        avatar: null
    },
    sent_at: '2024-01-01'
};

const mockOnClick = jest.fn();
const mockRefreshMessages = jest.fn();

describe('Message Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders outgoing message correctly', () => {
        render(
            <Message
                onClick={mockOnClick}
                type="outgoing"
                data={mockData}
                refreshMessages={mockRefreshMessages}
            />
        );

        expect(screen.getByText('01.01.2024')).toBeInTheDocument();
        expect(screen.getByText(/«Сообщение о проведении Годового Общего собрания Акционерного общества Компания»/)).toBeInTheDocument();
        expect(screen.queryByText('Отправить сообщение')).not.toBeInTheDocument();
    });

    it('renders draft message correctly', () => {
        render(
            <Message
                onClick={mockOnClick}
                type="drafts"
                data={mockData}
                refreshMessages={mockRefreshMessages}
            />
        );

        expect(screen.queryByText('01.01.2024')).not.toBeInTheDocument();
        expect(screen.getByText(/«Сообщение о проведении/)).toBeInTheDocument();
        expect(screen.getByText('Отправить сообщение')).toBeInTheDocument();
    });

    it('calls onClick when message is clicked', () => {
        render(
            <Message
                onClick={mockOnClick}
                type="outgoing"
                data={mockData}
                refreshMessages={mockRefreshMessages}
            />
        );

        const message = screen.getByText(/«Сообщение о проведении/).closest('div');
        if (message) {
            fireEvent.click(message);
            expect(mockOnClick).toHaveBeenCalled();
        }
    });

    it('shows success alert when message is sent successfully', async () => {
        (putMeeting as jest.Mock).mockResolvedValueOnce({});
        
        render(
            <Message
                onClick={mockOnClick}
                type="drafts"
                data={mockData}
                refreshMessages={mockRefreshMessages}
            />
        );

        const sendButton = screen.getByText('Отправить сообщение');
        await act(async () => {
            fireEvent.click(sendButton);
            await Promise.resolve(); // Ждем завершения асинхронных операций
        });

        await waitFor(() => {
            expect(Alert).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Сообщение успешно отправлено"
                }),
                expect.any(Object)
            );
            expect(mockRefreshMessages).toHaveBeenCalled();
        });

        await act(async () => {
            jest.advanceTimersByTime(3000);
            await Promise.resolve(); // Ждем завершения таймера
        });
    });

    it('shows error alert when message sending fails with network error', async () => {
        const headers = new AxiosHeaders();
        const axiosError = new AxiosError(
            'Network Error',
            'ECONNABORTED',
            undefined,
            undefined,
            {
                status: 0,
                data: null,
                statusText: '',
                headers: headers,
                config: { headers: headers }
            }
        );
        Object.defineProperty(axiosError, 'isAxiosError', { value: true });
        (putMeeting as jest.Mock).mockRejectedValueOnce(axiosError);
        
        render(
            <Message
                onClick={mockOnClick}
                type="drafts"
                data={mockData}
                refreshMessages={mockRefreshMessages}
            />
        );

        const sendButton = screen.getByText('Отправить сообщение');
        await act(async () => {
            fireEvent.click(sendButton);
            await Promise.resolve();
        });

        await waitFor(() => {
            expect(Alert).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Произошла ошибка при отправке сообщения"
                }),
                expect.any(Object)
            );
        });

        await act(async () => {
            jest.advanceTimersByTime(3000);
            await Promise.resolve();
        });
    });

    it('shows error alert when required fields are not filled', async () => {
        const headers = new AxiosHeaders();
        const axiosError = new AxiosError(
            'Bad Request',
            '400',
            undefined,
            undefined,
            {
                status: 400,
                data: { error: 'не заполнены обязательные поля' },
                statusText: 'Bad Request',
                headers: headers,
                config: { headers: headers }
            }
        );
        Object.defineProperty(axiosError, 'isAxiosError', { value: true });
        axiosError.response = {
            status: 400,
            data: { error: 'не заполнены обязательные поля' },
            statusText: 'Bad Request',
            headers: headers,
            config: { headers: headers }
        };
        (putMeeting as jest.Mock).mockRejectedValueOnce(axiosError);
        
        render(
            <Message
                onClick={mockOnClick}
                type="drafts"
                data={mockData}
                refreshMessages={mockRefreshMessages}
            />
        );

        const sendButton = screen.getByText('Отправить сообщение');
        await act(async () => {
            fireEvent.click(sendButton);
            await Promise.resolve();
        });

        await waitFor(() => {
            expect(Alert).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Нельзя отправить, заполнены не все поля"
                }),
                expect.any(Object)
            );
        });

        await act(async () => {
            jest.advanceTimersByTime(3000);
            await Promise.resolve();
        });
    });

    it('formats long text correctly for outgoing messages', () => {
        const longTextData: IMail = {
            ...mockData,
            issuer: {
                short_name: 'АО Очень Длинное Название Компании'
            }
        };

        render(
            <Message
                onClick={mockOnClick}
                type="outgoing"
                data={longTextData}
                refreshMessages={mockRefreshMessages}
            />
        );

        const text = screen.getByText(/«Сообщение о проведении/).textContent;
        expect(text).toMatch(/^«.*\.\.\.»$/);
        expect(text?.length).toBeLessThanOrEqual(96);
    });

    it('formats long text correctly for draft messages', () => {
        const longTextData: IMail = {
            ...mockData,
            issuer: {
                short_name: 'АО Очень Длинное Название Компании'
            }
        };

        render(
            <Message
                onClick={mockOnClick}
                type="drafts"
                data={longTextData}
                refreshMessages={mockRefreshMessages}
            />
        );

        const text = screen.getByText(/«Сообщение о проведении/).textContent;
        expect(text).toMatch(/^«.*\.\.\.»$/);
        expect(text?.length).toBeLessThanOrEqual(81);
    });

    it('renders repeated meeting message correctly', () => {
        const repeatedData: IMail = {
            ...mockData,
            first_or_repeated: false
        };

        render(
            <Message
                onClick={mockOnClick}
                type="outgoing"
                data={repeatedData}
                refreshMessages={mockRefreshMessages}
            />
        );

        expect(screen.getByText(/повторного/)).toBeInTheDocument();
    });

    it('renders unscheduled meeting message correctly', () => {
        const unscheduledData: IMail = {
            ...mockData,
            annual_or_unscheduled: false
        };

        render(
            <Message
                onClick={mockOnClick}
                type="outgoing"
                data={unscheduledData}
                refreshMessages={mockRefreshMessages}
            />
        );

        expect(screen.getByText(/Внеочередного/)).toBeInTheDocument();
    });
}); 