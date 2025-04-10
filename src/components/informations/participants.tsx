import { JSX, useEffect, useState } from "react"
import { RowParticipants } from "../row/rowParticipants"
import { ButtonParticipants } from "../button/buttonParticipants"
import { getUsersinMeetingAdmin } from "../../requests/requests"
import { IUsersInMeeting } from "../../requests/interfaces"

interface ParticipantsProps {
    status: number,
    idMeeting: number
}

export const Participants = (props: ParticipantsProps): JSX.Element => {
    const { status, idMeeting } = props
    const [users, setUsers] = useState<IUsersInMeeting[]>()

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await getUsersinMeetingAdmin(idMeeting)
                setUsers(data);
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getUsers()
    }, [idMeeting])
    console.log(users)

    return (
        <div>
            {status !== 5 &&
                <div className="text-2xl mb-4 text-(--color-red)">
                    Увидеть результаты участников можно после окончания голосования
                </div>
            }

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
                        {users?.map((user, idx) => (
                            <RowParticipants participants={user} key={idx} isClosed={status === 5} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}