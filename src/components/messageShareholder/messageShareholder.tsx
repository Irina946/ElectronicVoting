import { JSX } from "react"
import { formatedText } from "../message/message"
import { IMail } from "../../requests/interfaces"


interface IMessageShareholderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    messageShareholder: IMail,

}

const formatedDateBack = (date: string | null): string => {
    const arrDate = date?.split('-')
    return arrDate ? `${arrDate[2]}.${arrDate[1]}.${arrDate[0]}` : ''
}

export const MessageShareholder = (props: IMessageShareholderProps): JSX.Element => {
    const message = props.messageShareholder

    const nameCompany = message.issuer.short_name.slice(0, 2) === 'АО' ? message.issuer.short_name.slice(3) : message.issuer.short_name

    return <button className="text-left cursor-pointer hover:bg-(--color-gray) rounded-2xl"
        onClick={props.onClick}>
        {formatedDateBack(message.sent_at)}
        <div className={`
            py-[4px]
            px-[11px]
            flex
            items-center
            text-sm
            gap-[90px]
            `}>
            <div className="flex items-center ">
                <div className={`mr-3.5 rounded-full w-9 h-9`}
                    style={{ backgroundColor: message.created_by?.avatar || 'red' }}></div>
                <div className="w-[175px]">{message.created_by?.email}</div>

            </div>
            <div>
                {formatedText(`Сообщение о проведении ${message.annual_or_unscheduled
                    ? 'Годового'
                    : 'Внеочередного'} ${message.first_or_repeated
                        ? ''
                        : 'повторного'} Общего собрания Акционерного общества ${nameCompany}`, 'shareholder')}
            </div>

        </div>
    </button>
}