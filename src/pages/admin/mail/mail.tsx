import { JSX, useEffect, useState } from "react";
import { ButtonMessage } from "../../../components/button/buttonMessage";
import { Message } from "../../../components/message/message";
import { useNavigate } from "react-router";
import { IMail } from "../../../requests/interfaces";
import { getDrafts, getMeetings } from "../../../requests/requests";

export const Mail = (): JSX.Element => {

    const [messages, setMessages] = useState<Array<IMail>>([])

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

    return (
        <div className="w-[1016px] m-auto">
            <h1 className="text-[32px] text-(--color-text) my-7">Общее собрание акционеров</h1>
            <div className="flex mb-[20px] border-[0.5px] rounded-2xl h-[519px]">
                <div className="w-[185px] rounded-l-2xl p-[14px]  border-r-[0.5px]">
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
                <div className="w-[831px] overflow-y-scroll">
                    {messages.map((message) =>
                        <div key={message.meeting_id} className="border-b-[0.5px] border-(--color-text)">

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
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}