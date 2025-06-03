import { JSX, useEffect, useState } from "react";
import { ButtonMessage } from "../../../components/button/buttonMessage";
import { Message } from "../../../components/message/message";
import { useNavigate } from "react-router";
import { IMail } from "../../../requests/interfaces";
import { getDrafts, getMeetings } from "../../../requests/requests";
import { CustomInputDate } from "../../../components/input/customInputDate";
import { CustomSelect } from "../../../components/select/customSelect";

export const Mail = (): JSX.Element => {

    const [messages, setMessages] = useState<Array<IMail>>([])
    const [filters, setFilters] = useState({
        meetingDate: '',
        status: '',
        issuer: ''
    });

    const [currentType, setCurrentType] = useState<'outgoing' | 'drafts'>(() => {
        const savedType = localStorage.getItem('messageType');

        return savedType as 'outgoing' | 'drafts' || 'outgoing';
    });

    const refreshMessages = async () => {
        try {
            const data = currentType === 'outgoing'
                ? await getMeetings()
                : await getDrafts();
            setMessages(data);
        } catch (error) {
            console.error("Error refreshing messages:", error);
        }
    };

    useEffect(() => {
        const getMails = async () => {
            try {
                const data = currentType === 'outgoing'
                    ? await getMeetings()
                    : await getDrafts();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getMails()
        localStorage.setItem('messageType', currentType);
    }, [currentType]);

    const sortedMessages = messages.sort((a, b) => {
        if (currentType === 'drafts') {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        } else if (currentType === 'outgoing') {
            const sentAtA = a.sent_at ? new Date(a.sent_at).getTime() : 0;
            const sentAtB = b.sent_at ? new Date(b.sent_at).getTime() : 0;
            return sentAtB - sentAtA;
        }
        return 0;
    });

    const filteredMessages = sortedMessages.filter(message => {
        if (filters.meetingDate && message.meeting_date) {
            try {
                const messageDate = new Date(message.meeting_date).toISOString().split('T')[0];
                if (messageDate !== filters.meetingDate) return false;
            } catch (error) {
                console.error("Invalid date format:", error);
                return true;
            }
        }
        if (filters.status && message.status !== parseInt(filters.status)) return false;
        if (filters.issuer && !message.issuer.short_name.toLowerCase().includes(filters.issuer.toLowerCase())) return false;
        return true;
    });

    const handleButtonClick = (type: 'outgoing' | 'drafts') => {
        setCurrentType(type);

    };

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/admin/meeting/new');
    }

    const handleClickDraft = (id: number) => {
        navigate(`/admin/meeting/${id}/edit`, { state: { id } });
    }

    const handleClickMessage = (id: number) => {
        navigate(`/admin/meeting/${id}`, { state: { id } });
    }

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="w-[1100px] m-auto">
            <h1 className="text-[32px] text-(--color-text) my-7">Список собраний</h1>
            <div className="flex mb-[20px] border-[0.5px] rounded-2xl h-[519px]">
                <div className="w-[210px] rounded-l-2xl p-[14px]  border-r-[0.5px]">
                    <div className="border-b-[2px]">
                        <ButtonMessage
                            title='Создать сообщение'
                            color='yellow'
                            onClick={() => handleClick()}
                        />
                        <ButtonMessage
                            title='Отправленные'
                            color='empty'
                            onClick={() => handleButtonClick('outgoing')}
                            isSelected={currentType === 'outgoing'}
                        />
                        <ButtonMessage
                            title='Черновики'
                            color='empty'
                            onClick={() => handleButtonClick('drafts')}
                            isSelected={currentType === 'drafts'}
                        />
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-0.5 border-[1px]">
                            <CustomInputDate
                                value={filters.meetingDate}
                                onChange={(value) => handleFilterChange('meetingDate', value)}
                            />
                        </div>
                        <CustomSelect
                            value={filters.status}
                            onChange={(value) => handleFilterChange('status', value)}
                            options={[
                                { value: '', label: 'Все статусы' },
                                { value: '1', label: 'Ожидается' },
                                { value: '2', label: 'Открыта регистрация' },
                                { value: '3', label: 'Открыто голосование' },
                                { value: '4', label: 'Голосование завершено' },
                                { value: '5', label: 'Собрание завершено' }
                            ]}
                            placeholder="Все статусы"
                        />
                        <input
                            type="text"
                            className="w-full p-2 border-[1px] h-[30px] text-sm"
                            value={filters.issuer}
                            onChange={(e) => handleFilterChange('issuer', e.target.value)}
                            placeholder="Эмитент"
                        />
                    </div>
                </div>
                <div className="w-full overflow-y-scroll">
                    {filteredMessages.map((message) =>
                        <div key={message.meeting_id} className="w-[100%] border-b-[0.5px] border-(--color-text)">

                            <Message
                                data={message}
                                onClick={() =>
                                (currentType === 'drafts'
                                    ? handleClickDraft(message.meeting_id)
                                    : handleClickMessage(message.meeting_id)
                                )
                                }
                                type={currentType}
                                refreshMessages={refreshMessages}
                                status={message.status}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}