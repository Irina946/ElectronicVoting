import { JSX } from "react";
import { useLocation, useNavigate } from "react-router";
import { IUsersInMeeting } from "../../requests/interfaces";

interface ParticipantsProps {
    participants: IUsersInMeeting;
    isClosed: boolean;
}

export const RowParticipants = (props: ParticipantsProps): JSX.Element => {

    const participant = props.participants
    const isClosed = props.isClosed

    const navigate = useNavigate();
    const location = useLocation();
    const idMessage: { id: number } = location.state

    const onClick = (userId: number) => {
        const id = idMessage.id
        const userName = participant.account_fullname
        navigate(`/admin/meeting/${idMessage.id}/results/${userId}`, { state: { id, userId, userName } })
    }

    return (
        <div className="flex border-black border-t-[1px]">
            <div className="border-black border-r-[1px] p-3.5 w-[300px]">
                {participant.account_fullname}
            </div>
            <div className="border-black border-r-[1px] p-3.5 w-[200px]">
                {participant.account_id}
            </div>
            <div className="text-center p-3.5 w-[190px]">
                <button
                    className={`
                                w-[160px] 
                                h-[30px] 
                                border-[1px] 
                                border-(--color-border) 
                                rounded-lg 
                                text-sm
                                ${isClosed
                            ? 'bg-(--color-yellow-button) hover:bg-(--color-yellow) cursor-pointer'
                            : 'bg-(--color-icon-two) cursor-not-allowed'}
                                
                                `}
                    disabled={!isClosed}
                    onClick={() => onClick(participant.account_id)}
                >
                    Результаты голосования
                </button>
            </div>
        </div>

    )
}