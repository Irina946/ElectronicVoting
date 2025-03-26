import { JSX } from "react";
import { useLocation, useNavigate } from "react-router";

interface Participant {
    name: string;
    email: string;
    id: number
}

interface ParticipantsProps {
    participants: Participant;
    isClosed: boolean;
}

export const RowParticipants = (props: ParticipantsProps): JSX.Element => {

    const participant = props.participants
    const isClosed = props.isClosed

    const navigate = useNavigate();
    const location = useLocation();
    const idMessage: {id: number} = location.state

    const onClick = (id: number) => {
        navigate(`/admin/meeting/${idMessage.id}/results/${id}`, {state:  participant.name })
    }

    return (
        <div className="flex border-black border-t-[1px]">
            <div className="border-black border-r-[1px] p-3.5 w-[300px]">
                {participant.name}
            </div>
            <div className="border-black border-r-[1px] p-3.5 w-[200px]">
                {participant.email}
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
                                onClick={() => onClick(participant.id)}
                                >
                    Результаты голосования
                </button>
            </div>
        </div>

    )
}