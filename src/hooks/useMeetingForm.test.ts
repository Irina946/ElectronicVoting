import { renderHook, act } from '@testing-library/react';
import { useMeetingForm } from './useMeetingForm';
import { getDraftForId, getListCompany, postMeetingCreate, putDraft } from '../requests/requests';
import { IAgendaDetails } from '../requests/interfaces';

// Мокаем API запросы
jest.mock('../requests/requests', () => ({
    getDraftForId: jest.fn(),
    getListCompany: jest.fn(),
    postMeetingCreate: jest.fn(),
    putDraft: jest.fn()
}));

describe('useMeetingForm', () => {
    const mockCompanies = [
        { id: 1, name: 'Company 1' },
        { id: 2, name: 'Company 2' }
    ];

    const mockMeeting = {
        issuer: 1,
        annual_or_unscheduled: true,
        first_or_repeated: false,
        inter_or_extra_mural: true,
        meeting_location: 'Test Location',
        decision_date: '2024-03-20',
        record_date: '2024-03-20',
        checkin: '2024-03-20T14:00:00',
        closeout: '2024-03-20T15:00:00',
        meeting_open: '2024-03-20T16:00:00',
        meeting_close: '2024-03-20T17:00:00',
        early_registration: true,
        agenda: [],
        file: [],
        meeting_date: '2024-03-20',
        vote_counting: '2024-03-20T18:00:00',
        meeting_name: 'Test Meeting',
        meeting_url: 'http://test.com',
        status: 1
    };

    const mockAgendaDetails: IAgendaDetails[] = [
        {
            detail_text: 'Test Detail'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (getListCompany as jest.Mock).mockResolvedValue(mockCompanies);
        (getDraftForId as jest.Mock).mockResolvedValue(mockMeeting);
    });

    it('должен инициализироваться с дефолтными значениями', () => {
        const { result } = renderHook(() => useMeetingForm(-1, false));
        
        expect(result.current.formState.selectedType).toEqual({ value: false, repeat: false });
        expect(result.current.formState.selectedForm).toBe(false);
        expect(result.current.formState.selectedIssuer).toBe(0);
        expect(result.current.formState.selectedPlace).toBe('');
        expect(result.current.formState.checkedEarlyRegistration).toBe(false);
    });

    it('должен загружать список компаний при монтировании', async () => {
        const { result, rerender } = renderHook(() => useMeetingForm(-1, false));
        
        await act(async () => {
            await Promise.resolve();
            rerender();
        });

        expect(getListCompany).toHaveBeenCalled();
        expect(result.current.listCompany).toEqual(mockCompanies);
    });

    it('должен загружать данные собрания в режиме редактирования', async () => {
        const { result, rerender } = renderHook(() => useMeetingForm(1, true));
        
        await act(async () => {
            await Promise.resolve();
            rerender();
        });

        expect(getDraftForId).toHaveBeenCalledWith(1);
        expect(result.current.formState.selectedIssuer).toBe(1);
        expect(result.current.formState.selectedPlace).toBe('Test Location');
    });

    it('должен обновлять состояние при вызове updateState', () => {
        const { result } = renderHook(() => useMeetingForm(-1, false));
        
        act(() => {
            result.current.updateState('selectedPlace', 'New Location');
        });

        expect(result.current.formState.selectedPlace).toBe('New Location');
    });

    it('должен добавлять пункт повестки дня', () => {
        const { result } = renderHook(() => useMeetingForm(-1, false));
        const newAgenda = {
            question: 'Test Question',
            decision: 'Test Decision',
            cumulative: false,
            details: mockAgendaDetails,
            questionId: 1
        };

        act(() => {
            result.current.handleAgendaAdd(newAgenda);
        });

        expect(result.current.formState.agendas).toContainEqual(newAgenda);
    });

    it('должен удалять пункт повестки дня', () => {
        const { result } = renderHook(() => useMeetingForm(-1, false));
        const agenda = {
            question: 'Test Question',
            decision: 'Test Decision',
            cumulative: false,
            details: mockAgendaDetails,
            questionId: 1
        };

        act(() => {
            result.current.handleAgendaAdd(agenda);
            result.current.handleAgendaDelete(1);
        });

        expect(result.current.formState.agendas).not.toContainEqual(agenda);
    });

    it('должен сохранять новое собрание', async () => {
        const { result, rerender } = renderHook(() => useMeetingForm(-1, false));
        
        await act(async () => {
            await result.current.handleSaveMeeting();
            rerender();
        });

        expect(postMeetingCreate).toHaveBeenCalled();
        expect(result.current.isOpenAlert).toBe(true);
    });

    it('должен обновлять существующее собрание', async () => {
        const { result, rerender } = renderHook(() => useMeetingForm(1, true));
        
        await act(async () => {
            await result.current.handleSaveMeeting();
            rerender();
        });

        expect(putDraft).toHaveBeenCalledWith(1, expect.any(Object));
        expect(result.current.isOpenAlert).toBe(true);
    });

    it('должен обновлять пункт повестки дня', () => {
        const { result } = renderHook(() => useMeetingForm(-1, false));
        const initialAgenda = {
            question: 'Initial Question',
            decision: 'Initial Decision',
            cumulative: false,
            details: mockAgendaDetails,
            questionId: 1
        };
        const updatedAgenda = {
            question: 'Updated Question',
            decision: 'Updated Decision',
            cumulative: true,
            details: mockAgendaDetails,
            questionId: 1
        };

        act(() => {
            result.current.handleAgendaAdd(initialAgenda);
            result.current.handleAgendaUpdate(updatedAgenda, 0);
        });

        expect(result.current.formState.agendas[0]).toEqual(updatedAgenda);
    });

    it('должен обновлять время', () => {
        const { result } = renderHook(() => useMeetingForm(-1, false));
        const initialTime = result.current.formState.selectedTimeRegisterStart;
        
        act(() => {
            result.current.updateTimeField('selectedTimeRegisterStart', 15, 30);
        });

        const newTime = result.current.formState.selectedTimeRegisterStart as Date;
        expect(newTime.getHours()).toBe(15);
        expect(newTime.getMinutes()).toBe(30);
        expect(newTime).not.toEqual(initialTime);
    });

    it('должен обрабатывать ошибку при загрузке компаний', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (getListCompany as jest.Mock).mockRejectedValue(new Error('Ошибка загрузки компаний'));

        const { rerender } = renderHook(() => useMeetingForm(-1, false));
        
        await act(async () => {
            await Promise.resolve();
            rerender();
        });

        expect(consoleSpy).toHaveBeenCalledWith('Ошибка при получении компаний:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    it('должен обрабатывать ошибку при загрузке собрания', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (getDraftForId as jest.Mock).mockRejectedValue(new Error('Ошибка загрузки собрания'));

        const { rerender } = renderHook(() => useMeetingForm(1, true));
        
        await act(async () => {
            await Promise.resolve();
            rerender();
        });

        expect(consoleSpy).toHaveBeenCalledWith('Ошибка при получении собрания:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    it('должен обрабатывать ошибку при сохранении собрания', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (postMeetingCreate as jest.Mock).mockRejectedValue(new Error('Ошибка сохранения'));

        const { result, rerender } = renderHook(() => useMeetingForm(-1, false));
        
        await act(async () => {
            await result.current.handleSaveMeeting();
            rerender();
        });

        expect(consoleSpy).toHaveBeenCalledWith('Ошибка при сохранении встречи:', expect.any(Error));
        consoleSpy.mockRestore();
    });
}); 