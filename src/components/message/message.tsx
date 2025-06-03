/* eslint-disable react-refresh/only-export-components */
import { JSX, useState, useEffect } from "react";
import { ButtonMessage } from "../button/buttonMessage";
import { IMail } from "../../requests/interfaces";
import { putMeeting } from "../../requests/requests";
import { AxiosError } from "axios";
import { Alert } from "../modal/alert";

interface MessageProps {
    onClick: () => void;
    type: "outgoing" | "drafts";
    data: IMail;
    refreshMessages: () => void;
    status: number;
}

export const formatDateText = (dateString: string): string => {
    if (dateString === '') return ''
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

export const formatedDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`
}

const formatedDateBack = (date: string | null): string => {
    const arrDate = date?.split('-')
    return arrDate ? `${arrDate[2]}.${arrDate[1]}.${arrDate[0]}` : ''
}

export const formatedText = (text: string, type: "outgoing" | "drafts" | "shareholder"): string => {
    const maxLength = type === 'drafts' ? 80 : type === 'shareholder' ? 103 : 103;

    if (text.length <= maxLength) {
        return `«${text}»`;
    }

    return `«${text.substring(0, maxLength)}...»`;
};

export const Message = (props: MessageProps): JSX.Element => {
    const { onClick, data, type, status } = props;
    const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    useEffect(() => {
        if (isOpenAlert) {
            const timer = setTimeout(() => {
                setIsOpenAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpenAlert]);

    const nameCompany = data.issuer.short_name.startsWith('АО')
        ? data.issuer.short_name.slice(3)
        : data.issuer.short_name;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        try {
            await putMeeting(data.meeting_id);
            setAlertMessage("Сообщение успешно отправлено");
            setIsOpenAlert(true);
            setTimeout(() => {
                props.refreshMessages();
            }, 3000);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data?.error?.includes('не заполнены обязательные поля')) {
                    setAlertMessage("Нельзя отправить, заполнены не все поля");
                } else if (error.response?.data?.error) {
                    setAlertMessage(error.response.data.error);
                } else {
                    setAlertMessage("Произошла ошибка при отправке сообщения");
                }
                setIsOpenAlert(true);
            }
        }
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
                hover:bg-(--color-background)
                `}
            onClick={onClick}
        >
            {type === "outgoing" && (
                <div className="text-(--color-text) text-[13px] font-bold">
                    {formatedDateBack(data.sent_at)} {status === 5
                        ? <span className="text-green-500">✔</span> : <></>}
                </div>
            )}
            <div className={`
                flex 
                items-center 
                ${type === 'drafts' ? 'ml-[7px]' : 'ml-[5px]'}
            `}>
                <div className="flex justify-between w-full pr-[14px] items-center mt-[10px]">
                    <div className="mb-[10px]">
                        {formatedText(
                            `Сообщение о проведении ${data.annual_or_unscheduled
                                ? 'Годового'
                                : 'Внеочередного'} ${data.first_or_repeated
                                    ? ''
                                    : 'повторного'} Общего собрания Акционерного общества ${nameCompany} ${formatDateText(data.meeting_date)}`,
                            type
                        )}
                    </div>
                    {type === 'drafts' && (
                        <ButtonMessage
                            title='Отправить сообщение'
                            color='yellow'
                            textSize="text-sm"
                            onClick={handleClick}
                        />
                    )}
                </div>
            </div>
            {isOpenAlert && (
                <Alert
                    message={alertMessage}
                    onClose={() => setIsOpenAlert(false)}
                    data-testid="alert-message"
                />
            )}
        </div>
    );
};