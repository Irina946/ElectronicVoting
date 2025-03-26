import { JSX } from "react"
import { MessageShareholder } from "../../../components/messageShareholder/messageShareholder"
import { useNavigate } from "react-router"


const messages = [
    {
        id: 1,
        color: 'pink',
        email: 'AnnaRomanova@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания',
        isRead: false,
        date: new Date('2025-12-01T12:00:00Z')
    },
    {
        id: 2,
        color: 'green',
        email: 'StepanOlegovich@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: false,
        date: new Date('2025-11-01T12:00:00Z')
    },
    {
        id: 3,
        color: 'pink',
        email: 'AnnaRomanova@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: true,
        date: new Date('2025-10-30T12:00:00Z')
    },
    {
        id: 4,
        color: 'blue',
        email: 'PavelVladislavovich@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: true,
        date: new Date('2025-10-20T12:00:00Z')
    },
    {
        id: 5,
        color: 'blue',
        email: 'PavelVladislavovich@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: false,
        date: new Date('2025-10-11T12:00:00Z')
    },
    {
        id: 6,
        color: 'green',
        email: 'StepanOlegovich@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: true,
        date: new Date('2025-10-01T12:00:00Z')
    },
    {
        id: 7,
        color: 'yellow',
        email: 'MichailVictorovich@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: true,
        date: new Date('2025-09-22T12:00:00Z')
    },
    {
        id: 8,
        color: 'red',
        email: 'MariaFedorovna@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: true,
        date: new Date('2025-09-01T12:00:00Z')
    },
    {
        id: 9,
        color: 'yellow',
        email: 'MichailVictorovich@mail.ru',
        message: 'Сообщение о проведении годового Общего собрания акционеров Акционерного общества «Представляет',
        isRead: true,
        date: new Date('2025-08-22T12:00:00Z')
    },
    {
        id: 10,
        color: 'red',
        email: 'MariaFedorovna@mail.ru',
        message: 'Сообщение о проведении годового Общего',
        isRead: true,
        date: new Date('2025-08-01T12:00:00Z')
    }

]

export const MailShareholder = (): JSX.Element => {
    const navigate = useNavigate();

    const handleClickMessage = (id: number) => {
        navigate(`/user/meeting/${id}`, { state: { id } });
    }

    return (
        <div className="w-[1016px] m-auto">
            <h1 className="text-[32px] text-(--color-text) my-7">
                Общее собрание акционеров
            </h1>
            
            <div className="
                            flex 
                            gap-[5px] 
                            flex-col 
                            outline-[0.5px] 
                            rounded-2xl 
                            h-[456px] 
                            outline-(--color-text) 
                            mb-7 
                            px-7 
                            py-3.5
                            overflow-y-scroll
                            "
            >
                {messages.map((message) =>
                    <MessageShareholder messageShareholder={message} key={message.id} onClick={() => handleClickMessage(message.id)} />
                )}
            </div>
        </div>
    )
}