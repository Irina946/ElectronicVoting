import { JSX } from "react"
import { formatedDate, formatedText } from "../message/message"

interface IMessageShareholder {
    id: number,
    color: string,
    email: string,
    message: string,
    isRead: boolean
    date: Date
}

interface IMessageShareholderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    messageShareholder: IMessageShareholder,

}

export const MessageShareholder = (props: IMessageShareholderProps): JSX.Element => {
    const message = props.messageShareholder
    return <button className="text-left cursor-pointer hover:bg-(--color-gray) rounded-2xl"
        onClick={props.onClick}>
        {formatedDate(message.date)}
        <div className={`
            ${!message.isRead ? 'outline-[3px] outline-(--color-yellow-button) rounded-2xl' : 'outline-white'}
            py-[4px]
            px-[11px]
            flex
            items-center
            text-sm
            gap-[90px]
            `}>
            <div className="flex items-center ">
                <div className={`mr-3.5 rounded-full w-9 h-9`}
                    style={{ backgroundColor: message.color }}></div>
                <div className="w-[175px]">{message.email}</div>

            </div>
            <div>
                {formatedText(message.message, "shareholder")}
            </div>

        </div>
    </button>
}