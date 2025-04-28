import { addTimedate, getTimeFromString, mapMeetingCreateToFormStateEdit, parseListCompanyToOptions } from '../meeting';
import { IMeetingUpdate } from '../interfaces';
import { IListCompany } from '../../requests/interfaces';

describe('meeting utils', () => {
    describe('addTimedate', () => {
        it('должен корректно добавлять время к дате', () => {
            const date = '2024-03-20';
            const time = new Date();
            time.setHours(14, 30, 0, 0);

            const result = addTimedate(date, time);
            
            expect(result.getFullYear()).toBe(2024);
            expect(result.getMonth()).toBe(2); // март (0-based)
            expect(result.getDate()).toBe(20);
            expect(result.getHours()).toBe(14);
            expect(result.getMinutes()).toBe(30);
        });

        it('должен выбрасывать ошибку при неверном типе времени', () => {
            const date = '2024-03-20';
            const time = '14:30' as unknown as Date;

            expect(() => addTimedate(date, time)).toThrow('The \'time\' parameter must be a Date object');
        });
    });

    describe('getTimeFromString', () => {
        it('должен корректно преобразовывать строку времени в Date', () => {
            const timeStr = '14:30';
            const result = getTimeFromString(timeStr);

            expect(result.getHours()).toBe(14);
            expect(result.getMinutes()).toBe(30);
            expect(result.getSeconds()).toBe(0);
            expect(result.getMilliseconds()).toBe(0);
        });
    });

    describe('mapMeetingCreateToFormStateEdit', () => {
        it('должен корректно преобразовывать IMeetingUpdate в IFormState', () => {
            const mockMeetingUpdate: IMeetingUpdate = {
                issuer: 1,
                meeting_location: 'test-location',
                decision_date: '2024-03-20',
                record_date: '2024-03-19',
                meeting_date: '2024-03-20',
                checkin: new Date('2024-03-19T10:00:00Z'),
                closeout: new Date('2024-03-19T11:00:00Z'),
                meeting_open: new Date('2024-03-20T14:00:00Z'),
                meeting_close: new Date('2024-03-20T15:00:00Z'),
                vote_counting: new Date('2024-03-20T16:00:00Z'),
                annual_or_unscheduled: true,
                inter_or_extra_mural: true,
                first_or_repeated: true,
                early_registration: true,
                agenda: [{
                    question: 'Test question',
                    decision: 'Test decision',
                    cumulative: true,
                    details: []
                }],
                file: [],
                meeting_name: 'Test Meeting',
                status: 1,
                meeting_url: 'https://test.com'
            };

            const result = mapMeetingCreateToFormStateEdit(mockMeetingUpdate);

            expect(result.selectedType.value).toBe(true);
            expect(result.selectedType.repeat).toBe(true);
            expect(result.selectedForm).toBe(true);
            expect(result.selectedIssuer).toBe(1);
            expect(result.selectedPlace).toBe('test-location');
            expect(result.checkedEarlyRegistration).toBe(true);
            expect(result.selectedDateAcceptance).toBe('2024-03-20');
            expect(result.selectedDateDefinition).toBe('2024-03-19');
            expect(result.selectedDateRegisterStart).toBe('2024-03-19');
            expect(result.agendas).toHaveLength(1);
            expect(result.agendas[0].question).toBe('Test question');
            expect(result.agendas[0].decision).toBe('Test decision');
            expect(result.agendas[0].cumulative).toBe(true);
        });
    });

    describe('parseListCompanyToOptions', () => {
        it('должен корректно преобразовывать список компаний в опции', () => {
            const mockCompanies: IListCompany[] = [
                {
                    issuer_id: 1,
                    full_name: 'Company 1'
                },
                {
                    issuer_id: 2,
                    full_name: 'Company 2'
                }
            ];

            const result = parseListCompanyToOptions(mockCompanies);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                label: 'Company 1',
                value: 1
            });
            expect(result[1]).toEqual({
                label: 'Company 2',
                value: 2
            });
        });
    });
}); 