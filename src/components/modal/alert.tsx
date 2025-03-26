import { JSX } from "react";

interface IAlertProps {
    message: string;
    onClose: () => void;
}

export const Alert = (props: IAlertProps): JSX.Element => {
    const { message, onClose } = props;

    return (
        <div className="fixed 
                        bottom-4
                        right-4
                        bg-[#30303075]
                        w-[270px]
                        h-[80px]
                        p-[7px]
                        flex
                        flex-col
                        items-center

        ">
            <button onClick={onClose} className="self-end cursor-pointer">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7.5" cy="7.5" r="7.41477" fill="#EBEBEB" stroke="#333333" stroke-width="0.170455" />
                    <path d="M4.09131 4.08594L10.841 10.8356" stroke="#333333" stroke-width="1.02273" stroke-linecap="round" />
                    <path d="M4.09131 10.8359L10.841 4.08628" stroke="#333333" stroke-width="1.02273" stroke-linecap="round" />
                </svg>
            </button>
            <div className="text-white text-base mt-[6px]">
                {message}
            </div>

        </div>
    )
}