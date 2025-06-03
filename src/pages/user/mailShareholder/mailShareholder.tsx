import { JSX, useEffect, useState } from "react"
import { MessageShareholder } from "../../../components/messageShareholder/messageShareholder"
import { useNavigate } from "react-router"
import { IMail } from "../../../requests/interfaces"
import { getMeetings } from "../../../requests/requests"

export const MailShareholder = (): JSX.Element => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Array<IMail>>([])

    useEffect(() => {
        const getMails = async () => {
            try {
                const data = await getMeetings()
                setMessages(data);
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getMails()
    }, []);

    const handleClickMessage = (id: number) => {
        navigate(`/user/meeting/${id}`, { state: { id } });
    }

    

    return (
        <div className="w-[1016px] m-auto">
            <h1 className="text-[32px] text-(--color-text) my-7">
                Список собраний
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
                {messages.slice().reverse().map((message) =>
                    <MessageShareholder
                        messageShareholder={message}
                        key={message.meeting_id}
                        onClick={() => handleClickMessage(message.meeting_id)}
                    />
                )}
            </div>
        </div>
    )
}