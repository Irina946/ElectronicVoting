import { JSX } from "react";

interface Participant {
    name: string;
    email: string;
    voices: number;
}

interface ParticipantsProps {
    participants: Participant
}

export const RowParticipants = (props: ParticipantsProps): JSX.Element => {

    const participant = props.participants

    return (
        <div className="flex border-black border-t-[1px]">
            <div className="border-black border-r-[1px] p-3.5 w-[300px]">
                {participant.name}
            </div>
            <div className="border-black border-r-[1px] p-3.5 w-[250px]">
                {participant.email}
            </div>
            <div className="text-center p-3.5 w-[100px]">
                {participant.voices}
            </div>
        </div>

    )
}