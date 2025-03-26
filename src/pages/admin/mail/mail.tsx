import { JSX, useEffect, useState } from "react";
import { ButtonMessage } from "../../../components/button/buttonMessage";
import { Message } from "../../../components/message/message";
import { useNavigate } from "react-router";

const messages = [
    {
        id: 2,
        content: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Предприятия 123»',
        type: 'outgoing',
        isRead: false,
        date: new Date('2025-10-02T12:00:00Z')
    },
    {
        id: 3,
        content: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Предприятия 123»',
        type: 'drafts',
        isRead: true,
        date: new Date('2025-10-03T12:00:00Z')
    },
    {
        id: 5,
        content: 'Запрос на предоставление финансовых отчетов',
        type: 'outgoing',
        isRead: true,
        date: new Date('2025-10-05T12:00:00Z')
    },
    {
        id: 7,
        content: 'Изменение в расписании собраний',
        type: 'drafts',
        isRead: false,
        date: new Date('2025-10-07T12:00:00Z')
    },
    {
        id: 9,
        content: 'Ответ на запрос о встрече',
        type: 'outgoing',
        isRead: false,
        date: new Date('2025-10-09T12:00:00Z')
    },
    {
        id: 11,
        content: 'Обновление информации о компании',
        type: 'drafts',
        isRead: false,
        date: new Date('2025-10-11T12:00:00Z')
    },
    {
        id: 13,
        content: 'Подтверждение изменения данных акционеров',
        type: 'outgoing',
        isRead: false,
        date: new Date('2025-10-13T12:00:00Z')
    },
    {
        id: 15,
        content: 'Запрос на дополнительные документы',
        type: 'outgoing',
        isRead: false,
        date: new Date('2025-10-15T12:00:00Z')
    },
    {
        id: 17,
        content: 'Подтверждение получения информации о новых акционерах',
        type: 'outgoing',
        isRead: false,
        date: new Date('2025-10-17T12:00:00Z')
    },
];
export const Mail = (): JSX.Element => {
    const [currentType, setCurrentType] = useState<'outgoing' | 'drafts'>(() => {
        const savedType = localStorage.getItem('messageType');
        return savedType as 'outgoing' | 'drafts' || 'outgoing';
    });

    useEffect(() => {
        localStorage.setItem('messageType', currentType);
    }, [currentType]);

    const handleButtonClick = (type: 'outgoing' | 'drafts') => {
        setCurrentType(type);
    };

    const filteredMessages = messages.filter(message => message.type === currentType);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/admin/meeting/new');
    }

    const handleClickDraft = (id: number) => {
        navigate(`/admin/meeting/${id}/edit`, {state: {id}});
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
                    {filteredMessages.map((message, index: number) =>
                        <div key={index} className="border-b-[0.5px] border-(--color-text)">

                            <Message
                                title={message.content}
                                onClick={() =>
                                (currentType === 'drafts'
                                    ? handleClickDraft(message.id)
                                    : handleClickMessage(message.id)
                                )
                                }
                                date={message.date}
                                isRead={message.isRead}
                                type={currentType}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}