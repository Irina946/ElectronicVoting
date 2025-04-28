import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    getMeetings,
    getDrafts,
    getMeetingForId,
    getMeetingForIdUser,
    getUsersinMeetingAdmin,
    postMeetingCreate,
    getListCompany,
    getMeetingResults,
    getMeetingAllResult,
    getDraftForId,
    putDraft,
    putMeeting,
    postRegister,
    getAccounts,
    postVote
} from '../requests';
import { IMeetingCreate, VoteDtls, IPutDrafts } from '../interfaces';

describe('API Requests', () => {
    let mock: MockAdapter;
    const API_URL = 'http://localhost:8000/';
    const mockToken = 'test-token';

    beforeEach(() => {
        mock = new MockAdapter(axios);
        localStorage.setItem('user', JSON.stringify(mockToken));
    });

    afterEach(() => {
        mock.restore();
        localStorage.clear();
    });

    describe('getMeetings', () => {
        it('должен успешно получать список собраний', async () => {
            const mockData = [{ id: 1, title: 'Test Meeting' }];
            mock.onGet(`${API_URL}api/meetings/`).reply(200, mockData);

            const result = await getMeetings();
            expect(result).toEqual(mockData);
        });

        it('должен обрабатывать ошибку при получении собраний', async () => {
            mock.onGet(`${API_URL}api/meetings/`).reply(500);

            await expect(getMeetings()).rejects.toThrow();
        });
    });

    describe('getDrafts', () => {
        it('должен успешно получать черновики', async () => {
            const mockData = [{ id: 1, title: 'Draft Meeting' }];
            mock.onGet(`${API_URL}api/meetings/drafts/`).reply(200, mockData);

            const result = await getDrafts();
            expect(result).toEqual(mockData);
        });
    });

    describe('getMeetingForId', () => {
        it('должен успешно получать собрание по ID', async () => {
            const mockData = { id: 1, title: 'Specific Meeting' };
            mock.onGet(`${API_URL}api/meetings/1/`).reply(200, mockData);

            const result = await getMeetingForId(1);
            expect(result).toEqual(mockData);
        });
    });

    describe('getMeetingForIdUser', () => {
        it('должен успешно получать собрание для пользователя', async () => {
            const mockData = { id: 1, title: 'User Meeting' };
            mock.onGet(`${API_URL}1/vote/1/`).reply(200, mockData);

            const result = await getMeetingForIdUser(1, 1);
            expect(result).toEqual(mockData);
        });
    });

    describe('getUsersinMeetingAdmin', () => {
        it('должен успешно получать список пользователей в собрании', async () => {
            const mockData = [{ account_id: 1, account_fullname: 'Test User' }];
            mock.onGet(`${API_URL}1/registered_users/`).reply(200, mockData);

            const result = await getUsersinMeetingAdmin(1);
            expect(result).toEqual(mockData);
        });
    });

    describe('postMeetingCreate', () => {
        it('должен успешно создавать новое собрание', async () => {
            const meetingData: IMeetingCreate = {
                issuer: 1,
                meeting_location: 'Test Location',
                decision_date: '2024-03-20',
                record_date: '2024-03-20',
                meeting_date: '2024-03-20',
                checkin: new Date('2024-03-20T10:00:00'),
                closeout: new Date('2024-03-20T11:00:00'),
                meeting_open: new Date('2024-03-20T10:00:00'),
                meeting_close: new Date('2024-03-20T12:00:00'),
                vote_counting: new Date('2024-03-20T12:00:00'),
                annual_or_unscheduled: true,
                inter_or_extra_mural: true,
                first_or_repeated: true,
                early_registration: true,
                agenda: [],
                file: []
            };
            const mockResponse = {
                id: 1,
                issuer: 1,
                meeting_location: "Test Location",
                decision_date: "2024-03-20",
                record_date: "2024-03-20",
                meeting_date: "2024-03-20",
                checkin: "2024-03-20T05:00:00.000Z",
                closeout: "2024-03-20T06:00:00.000Z",
                meeting_open: "2024-03-20T05:00:00.000Z",
                meeting_close: "2024-03-20T07:00:00.000Z",
                vote_counting: "2024-03-20T07:00:00.000Z",
                annual_or_unscheduled: true,
                inter_or_extra_mural: true,
                first_or_repeated: true,
                early_registration: true,
                agenda: [],
                file: []
            };
            mock.onPost(`${API_URL}api/meetings/create/`).reply(200, mockResponse);

            const result = await postMeetingCreate(meetingData);
            expect(result).toEqual(mockResponse);
        });

        it('должен обрабатывать ошибку при создании собрания', async () => {
            const meetingData: IMeetingCreate = {
                issuer: 1,
                meeting_location: 'Test Location',
                decision_date: '2024-03-20',
                record_date: '2024-03-20',
                meeting_date: '2024-03-20',
                checkin: new Date('2024-03-20T10:00:00'),
                closeout: new Date('2024-03-20T11:00:00'),
                meeting_open: new Date('2024-03-20T10:00:00'),
                meeting_close: new Date('2024-03-20T12:00:00'),
                vote_counting: new Date('2024-03-20T12:00:00'),
                annual_or_unscheduled: true,
                inter_or_extra_mural: true,
                first_or_repeated: true,
                early_registration: true,
                agenda: [],
                file: []
            };
            mock.onPost(`${API_URL}api/meetings/create/`).reply(500);

            await expect(postMeetingCreate(meetingData)).rejects.toThrow();
        });
    });

    describe('getListCompany', () => {
        it('должен успешно получать список компаний', async () => {
            const mockData = [{ issuer_id: 1, full_name: 'Test Company' }];
            mock.onGet(`${API_URL}/api/meetings/create/`).reply(200, mockData);

            const result = await getListCompany();
            expect(result).toEqual(mockData);
        });
    });

    describe('getMeetingResults', () => {
        it('должен успешно получать результаты голосования', async () => {
            const mockData = { meeting_id: 1, results: [] };
            mock.onGet(`${API_URL}1/vote_results/1/`).reply(200, mockData);

            const result = await getMeetingResults(1, 1);
            expect(result).toEqual(mockData);
        });
    });

    describe('getMeetingAllResult', () => {
        it('должен успешно получать все результаты голосования', async () => {
            const mockData = { account_id: 1, data: {}, SummarizedVoteResults: [] };
            mock.onGet(`${API_URL}1/all_vote_results/`).reply(200, mockData);

            const result = await getMeetingAllResult(1);
            expect(result).toEqual(mockData);
        });
    });

    describe('getDraftForId', () => {
        it('должен успешно получать черновик по ID', async () => {
            const mockData = { id: 1, title: 'Draft' };
            mock.onGet(`${API_URL}/api/meetings/1/draft/`).reply(200, mockData);

            const result = await getDraftForId(1);
            expect(result).toEqual(mockData);
        });
    });

    describe('putDraft', () => {
        it('должен успешно обновлять черновик', async () => {
            const draftData: IPutDrafts = {
                meeting_id: 1,
                issuer: 1,
                meeting_location: 'New Location',
                decision_date: '2024-03-20',
                record_date: '2024-03-20',
                meeting_date: '2024-03-20',
                checkin: new Date('2024-03-20T10:00:00'),
                closeout: new Date('2024-03-20T11:00:00'),
                meeting_open: new Date('2024-03-20T10:00:00'),
                meeting_close: new Date('2024-03-20T12:00:00'),
                vote_counting: new Date('2024-03-20T12:00:00'),
                annual_or_unscheduled: true,
                inter_or_extra_mural: true,
                first_or_repeated: true,
                early_registration: true,
                agenda: [],
                file: [],
                meeting_name: 'Test Meeting',
                status: 1,
                meeting_url: 'http://test.com'
            };
            mock.onPut(`${API_URL}/api/meetings/1/draft/`).reply(200);

            await expect(putDraft(1, draftData)).resolves.not.toThrow();
        });
    });

    describe('putMeeting', () => {
        it('должен успешно обновлять собрание', async () => {
            mock.onPut(`${API_URL}/api/meetings/1/send/`).reply(200);

            await expect(putMeeting(1)).resolves.not.toThrow();
        });
    });

    describe('postRegister', () => {
        it('должен успешно регистрировать пользователя', async () => {
            const mockData = { message: 'Success' };
            mock.onPost(`${API_URL}/1/register/`).reply(200, mockData);

            const result = await postRegister(1);
            expect(result).toEqual(mockData);
        });
    });

    describe('getAccounts', () => {
        it('должен успешно получать список аккаунтов', async () => {
            const mockData = { meeting_id: 1, accounts: [] };
            mock.onGet(`${API_URL}/api/meetings/1/accounts/`).reply(200, mockData);

            const result = await getAccounts(1);
            expect(result).toEqual(mockData);
        });
    });

    describe('postVote', () => {
        it('должен успешно отправлять голос', async () => {
            const voteData: VoteDtls = {
                VoteInstrForAgndRsltn: [{
                    VoteInstr: {
                        QuestionId: 1,
                        For: { Quantity: 100 }
                    }
                }]
            };
            const mockResponse = { success: true };
            mock.onPost(`${API_URL}api/meetings/1/vote/1/`).reply(200, mockResponse);

            await expect(postVote(1, voteData, 1)).resolves.not.toThrow();
        });

        it('должен обрабатывать ошибку при отправке голоса', async () => {
            const voteData: VoteDtls = {
                VoteInstrForAgndRsltn: [{
                    VoteInstr: {
                        QuestionId: 1,
                        For: { Quantity: 100 }
                    }
                }]
            };
            mock.onPost(`${API_URL}api/meetings/1/vote/1/`).reply(500);

            await expect(postVote(1, voteData, 1)).resolves.not.toThrow();
        });
    });
}); 