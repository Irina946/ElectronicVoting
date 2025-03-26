import { JSX } from "react"
import { RowParticipants } from "../row/rowParticipants"
import { ButtonParticipants } from "../button/buttonParticipants"

const participants = [
    {
        name: "Иванов Иван Иванович",
        email: "40702810206000000001",
        id: 556
    },
    {
        name: "Смирнов Алексей Иванович",
        email: "40702810006000000010",
        id: 557
    },
    {
        name: "Петров Петр Петрович",
        email: "40702810306000000011",
        id: 558
    },
    {
        name: "Олегов Олег Олегович",
        email: "40702810606000000012",
        id: 559
    },
    {
        name: "Андреев Андрей Андреевич",
        email: "40702810906000000013",
        id: 560
    },
    {
        name: "Степанов Степан Степанович",
        email: "40702810206000000014",
        id: 561
    },
    {
        name: "Максимов Максим Максимович",
        email: "40702810206000000019",
        id: 562
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
        <div>
            <div className="text-2xl mb-4 text-(--color-red)">
                Увидеть результаты участников можно после окончания голосования
            </div>
            
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
                        <div className="border-r-[1px] border-black w-[200px] py-[7px] px-3.5">
                            Лицевой счёт
                        </div>
                        <div className="w-[190px] py-[7px] px-3.5">
                        </div>
                    </div>
                    <div>
                        {participants.map((participant, idx) => (
                            <RowParticipants participants={participant} key={idx} isClosed={laterDate} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}