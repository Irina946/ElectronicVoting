import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Row } from './row';
import { HeaderRow } from './headerRow';
import { RowParticipants } from './rowParticipants';
import { Modal } from '../modal/modal';
import { IAgendaCreate, IUsersInMeeting } from '../../requests/interfaces';

// Мокаем компоненты
jest.mock('../modal/modal');

// Мокаем SVG импорты
jest.mock('../../assets/plus.svg', () => 'plus-mock');
jest.mock('../../assets/minus.svg', () => 'minus-mock');
jest.mock('../../assets/edit.svg', () => 'edit-mock');
jest.mock('../../assets/arrowCheckbox.svg', () => 'ok-mock');

describe('Row Components', () => {
    describe('HeaderRow', () => {
        it('renders header row with correct columns', () => {
            render(<HeaderRow />);
            expect(screen.getByText('Номер вопроса')).toBeInTheDocument();
            expect(screen.getByText('Вопрос')).toBeInTheDocument();
            expect(screen.getByText('Кандидаты/подвопросы')).toBeInTheDocument();
            expect(screen.getByText('Решение')).toBeInTheDocument();
            expect(screen.getByText('Кумулятивные голоса')).toBeInTheDocument();
        });
    });

    const mockAgenda: IAgendaCreate = {
        questionId: 1,
        question: 'Test Question',
        decision: 'Test Decision',
        cumulative: true,
        details: [
            { detail_text: 'Option 1' },
            { detail_text: 'Option 2' }
        ]
    };

    const mockOnChange = jest.fn();
    const mockOnDelete = jest.fn();

    describe('Row', () => {
        it('renders empty row with plus button', () => {
            render(
                <BrowserRouter>
                    <Row agenda={null} onChange={mockOnChange} index={1} />
                </BrowserRouter>
            );
            expect(screen.getByTestId('plus-button')).toBeInTheDocument();
        });

        it('renders row with agenda data', () => {
            render(
                <BrowserRouter>
                    <Row agenda={mockAgenda} onChange={mockOnChange} index={1} onDelete={mockOnDelete} />
                </BrowserRouter>
            );
            expect(screen.getByText('Test Question')).toBeInTheDocument();
            expect(screen.getByText('Test Decision')).toBeInTheDocument();
            expect(screen.getByText('Option 1')).toBeInTheDocument();
            expect(screen.getByText('Option 2')).toBeInTheDocument();
        });

        it('opens modal when plus button is clicked', () => {
            render(<Row agenda={null} onChange={mockOnChange} index={1} />);
            fireEvent.click(screen.getByTestId('plus-button'));
            expect(Modal).toHaveBeenCalled();
        });

        it('calls onDelete when minus button is clicked', () => {
            render(
                <BrowserRouter>
                    <Row agenda={mockAgenda} onChange={mockOnChange} index={1} onDelete={mockOnDelete} />
                </BrowserRouter>
            );
            fireEvent.click(screen.getByTestId('minus-button'));
            expect(mockOnDelete).toHaveBeenCalledWith(0);
        });

        it('opens modal in edit mode when edit button is clicked', () => {
            render(
                <BrowserRouter>
                    <Row agenda={mockAgenda} onChange={mockOnChange} index={1} onDelete={mockOnDelete} />
                </BrowserRouter>
            );
            fireEvent.click(screen.getByTestId('edit-button'));
            expect(Modal).toHaveBeenCalled();
        });
    });

    describe('RowParticipants', () => {
        const mockParticipant: IUsersInMeeting = {
            account_id: 123,
            account_fullname: 'John Doe',
            has_voted: true
        };

        it('renders participant data correctly', () => {
            render(
                <BrowserRouter>
                    <RowParticipants participants={mockParticipant} isClosed={true} />
                </BrowserRouter>
            );
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('123')).toBeInTheDocument();
            expect(screen.getByText('Результаты голосования')).toBeInTheDocument();
        });

        it('disables button when isClosed is false', () => {
            render(
                <BrowserRouter>
                    <RowParticipants participants={mockParticipant} isClosed={false} />
                </BrowserRouter>
            );
            const button = screen.getByText('Результаты голосования');
            expect(button).toBeDisabled();
        });

        it('enables button when isClosed is true', () => {
            render(
                <BrowserRouter>
                    <RowParticipants participants={mockParticipant} isClosed={true} />
                </BrowserRouter>
            );
            const button = screen.getByText('Результаты голосования');
            expect(button).not.toBeDisabled();
        });
    });
}); 