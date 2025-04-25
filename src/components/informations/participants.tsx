import { JSX, useEffect, useState } from "react"
import { RowParticipants } from "../row/rowParticipants"
import { ButtonParticipants } from "../button/buttonParticipants"
import { getUsersinMeetingAdmin } from "../../requests/requests"
import { IUsersInMeeting } from "../../requests/interfaces"
import * as XLSX from 'xlsx'

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

    const downloadExcel = () => {
        if (!users) return;

        const worksheet = XLSX.utils.json_to_sheet(
            users.map(user => ({
                'ФИО': user.account_fullname,
                'Лицевой счет': user.account_id
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Участники");
        
        XLSX.writeFile(workbook, `участники_${idMeeting}.xlsx`);
    };

    return (
        <div>
            {status !== 5 &&
                <div className="text-2xl mb-4 text-(--color-red)">
                    Увидеть результаты участников можно после окончания голосования
                </div>
            }
            {users?.length === 0 ? <div className="text-2xl mb-4 text-(--color-red)">Нет зарегистрировавшихся участников</div> :
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
                        onClick={downloadExcel}
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
            }
        </div>
    )
}