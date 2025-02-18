import { JSX } from "react";
import { ButtonMessage } from "../button/buttonMessage";

interface MessageProps {
    title: string;
    onClick: () => void;
    date: Date;
    isRead: boolean;
    type: "incoming" | "outgoing" | "drafts";
}

const formatedDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`
}

const formatedText = (text: string, type: "incoming" | "outgoing" | "drafts"): string => {
    if (type === 'drafts') {
        if (text.length <= 76) {
            return `«${text}»`
        }
        return `«${text.substring(0, 76)}...»`;
    }
    if (text.length <= 91) {
        return `«${text}»`
    }
    const newText = `«${text.substring(0, 91)}...»`;
    return newText
}


export const Message = (props: MessageProps): JSX.Element => {
    const { title, onClick, date, isRead, type } = props;

    const circleStyle = () => {
        if (type === 'incoming') {
            return isRead ? 'bg-transparent' : 'bg-(--color-red)';
        } else if (type === 'outgoing') {
            return isRead ? 'bg-(--color-green)' : 'bg-(--color-red)';
        } else if (type === 'drafts') {
            return 'hidden';
        }
        return '';
    };

    return (
        <div
            className={`
                w-[100%] 
                h-[73px] 
                py-[14px]
                pl-[7px]
                text-(--color-text)
                cursor-pointer
                `}
            onClick={onClick}
        >
            <div className="text-(--color-text) text-[13px] font-bold">
                {formatedDate(date)}
            </div>
            <div className={`
                                flex 
                                items-center 
                                ${type === 'drafts' ? 'ml-[7px]' : 'ml-[28px]'}  
                                ${type === 'incoming' && !isRead ? 'font-bold' : ''}
                            `}>
                <div className={`
                    w-[13px] 
                    h-[13px] 
                    rounded-full
                    ${circleStyle()}
                    mr-[7px]
                    text-(--color-text)
                    text-base
                    `}></div>
                <div className="flex justify-between w-full pr-[14px]">
                    {formatedText(title, type)}
                    {type === 'drafts' && (
                        <ButtonMessage title='Отправить сообщение' color='yellow' textSize="text-sm" onClick={() => { }} />
                    )}
                </div>

            </div>


        </div>
    );
};