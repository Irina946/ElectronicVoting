import { JSX } from "react"
import { RowParticipants } from "../row/rowParticipants"
import { ButtonParticipants } from "../button/buttonParticipants"

const participants = [
    {
        name: "Иванов Иван Иванович",
        email: "yeg_ederadi71@mail.ru",
        voices: 100
    },
    {
        name: "Смирнов Алексей Иванович",
        email: "haseku_vaxo7@list.ru",
        voices: 500
    },
    {
        name: "Петров Петр Петрович",
        email: "xacakop_upo17@internet.ru",
        voices: 20
    },
    {
        name: "Олегов Олег Олегович",
        email: "depi-jufoxe39@internet.ru",
        voices: 300
    },
    {
        name: "Андреев Андрей Андреевич",
        email: "sagawaz_ewi42@internet.ru",
        voices: 299
    },
    {
        name: "Степанов Степан Степанович",
        email: "webuk-abovi53@aol.com",
        voices: 800
    },
    {
        name: "Максимов Максим Максимович",
        email: "sekihi-yipo45@internet.ru",
        voices: 1000
    }
]

interface ParticipantsProps {
    endDate: Date
}

export const Participants = (props: ParticipantsProps): JSX.Element => {
    const endDate = props.endDate
    const nowDate = new Date()
    const laterDate = endDate.getTime() < nowDate.getTime() ? true : false;
    return (
        <div className="flex gap-0">
            <div
                className="
                            border-y-[1px]
                            border-y-black
                            border-l-[1px]
                            border-l-black
                            p-3.5
                            w-[185px]
                            flex
                            flex-col
                            gap-3.5
                            "
            >
                <div className={`${laterDate ? "hidden" : ""}`}>
                    <ButtonParticipants
                    color="yellow"
                    title="Пригласить участника"
                    
                    onClick={() => { }}
                />
                </div>
                
                <ButtonParticipants
                    color="gray"
                    title="Скачать список"
                    onClick={() => { }}
                />
            </div>
            <div
                className="
                border-[1px]
                border-black
                
                "
            >
                <div className="flex h-9 ">
                    <div className="border-r-[1px] border-black w-[300px] py-[7px] px-3.5">
                        ФИО
                    </div>
                    <div className="border-r-[1px] border-black w-[250px] py-[7px] px-3.5">
                        Email
                    </div>
                    <div className="w-[100px] py-[7px] px-3.5">
                        Голоса
                    </div>
                </div>
                <div>
                    {participants.map((participant, idx) => (
                        <RowParticipants participants={participant} key={idx} />
                    ))}
                </div>
            </div>
        </div>
    )
}