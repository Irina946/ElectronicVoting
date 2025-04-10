import { JSX, useEffect, useState } from "react";
import { RowVotingOne } from "../../../components/rowVoting/rowVotingOne";
import { RowVotingNotCandidates } from "../../../components/rowVoting/rowVotingNotCandidates";
import { RowVotingCandidatesCumulative } from "../../../components/rowVoting/rowVotingCandidatesCumulative";
import { RowVotingCandidates } from "../../../components/rowVoting/rowVotingCandidates";
import { IAgenda, IMeetingUsers } from "../../../requests/interfaces";
import { getMeetingForIdUser, postVote } from "../../../requests/requests";
import { useLocation, useNavigate } from "react-router";
import { ButtonMessageAdmin } from "../../../components/button/buttonMessageAdmin";
import { Modal } from "../../../components/modal/modal";
import { Button } from "../../../components/button/button";
import { formatedDate, transformToVoteDtls } from "../../../utils/functions";

export const Voting = (): JSX.Element => {
    const [votes, setVotes] = useState<{ [key: number]: string | { [candidate: number]: number | string } }>({});
    const [informations, setInformations] = useState<IMeetingUsers>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [isSave, setIsSave] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    const idMeeting: { id: number, userId: number } = location.state

    useEffect(() => {
        const getMeeting = async () => {
            try {
                const data = await getMeetingForIdUser(idMeeting.id, idMeeting.userId)
                setInformations(data)
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getMeeting()
    }, [idMeeting]);

    console.log(informations)


    const handleVoteChange = (agendaNumber: number, vote: string | { [candidate: number]: number | string }) => {
        setVotes(prev => ({ ...prev, [agendaNumber]: vote }));
    };

    const handleClickButtonResult = () => {
        setIsOpenModal(true)
    }

    const handleSendResult = () => {
        const postVotes = async () => {
            try {
                await postVote(idMeeting.id, transformToVoteDtls(votes), idMeeting.userId)
            } catch (error) {
                console.error("Error:", error)
            }
        }
        postVotes();
        setIsSave(true)
    }

    const votesCount = informations ? informations?.vote_count.VoteDtls.VoteInstrForAgndRsltn[0].Quantity : 0

   


    return (
        <>
            {informations === undefined
                ? (<div className="flex justify-center items-center m-auto">
                    <div className="loader"></div>
                </div>)
                :
                <div className="w-[1016px] m-auto">
                    <h1 className="text-[32px] text-(--color-text) my-7">
                        Голосование
                    </h1>
                    <div className="
                            w-full
                            py-3.5
                            px-7
                            bg-gray
                            outline-[0.5px]
                            outline-black
                            rounded-2xl
                            text-sm
                            text-(--color-text)
                            ">
                        <p className="font-bold text-center">
                            {informations?.annual_or_unscheduled
                                ? 'ГОДОВОЕ'
                                : 'ВНЕОЧЕРЕДНОЕ'} {informations?.first_or_repeated
                                    ? ''
                                    : 'ПОВТОРНОЕ'} СООБРАНИЕ АКЦИОНЕРОВ
                        </p>
                        <p className="font-bold text-center pb-6">
                            {informations?.meeting_name}
                        </p>
                        <div className="flex justify-between mb-7">
                            <div className="flex gap-3.5 items-center">
                                <div>
                                    Дата, время окончания приёма бюллетеней:
                                </div>
                                <div className="bg-white py-[5px] px-2 ">
                                    {formatedDate(informations?.deadline_date || '')}
                                </div>
                                <div className="bg-white py-[5px] px-2 ">
                                    23:59 мск
                                </div>
                            </div>
                            <div>
                                <a className="text-(--color-red) underline font-bold">
                                    Материалы собрания
                                </a>
                            </div>
                        </div>
                        {informations.agenda.map((agenda: IAgenda, idx: number) => (
                            <>
                                {
                                    agenda.details.length === 0 && idx === 0 &&
                                    <RowVotingOne
                                        agenda={agenda}
                                        onVoteChange={handleVoteChange}
                                        key={agenda.question_id}
                                        numberQuestion={idx + 1}
                                    />
                                }
                                {
                                    agenda.details.length === 0 && idx !== 0 &&
                                    <RowVotingNotCandidates
                                        agenda={agenda}
                                        onVoteChange={handleVoteChange}
                                        key={agenda.question_id}
                                        numberQuestion={idx + 1}
                                    />
                                }
                                {
                                    agenda.details.length !== 0 && idx !== 0 && agenda.cumulative &&
                                    <RowVotingCandidatesCumulative
                                        agenda={agenda}
                                        onVoteChange={handleVoteChange}
                                        totalVotes={votesCount * agenda.seat_count}
                                        key={agenda.question_id}
                                        numberQuestion={idx + 1}
                                    />
                                }
                                {
                                    agenda.details.length !== 0 && idx !== 0 && !agenda.cumulative &&
                                    <RowVotingCandidates
                                        agenda={agenda}
                                        key={agenda.question_id}
                                        onVoteChange={handleVoteChange}
                                        numberQuestion={idx + 1}
                                    />
                                }
                            </>
                        ))}
                        <div className="flex items-center w-full justify-center mt-7 mb-3.5">
                            <ButtonMessageAdmin onClick={() => handleClickButtonResult()} title="Проголосовать" isSelected={false} />
                        </div>

                    </div>
                    {isOpenModal && <Modal onClose={() => { setIsOpenModal(false) }} visible={isOpenModal}>
                        {isSave
                            ? <div className="flex flex-col items-center justify-center">
                                <div>Вы успешно проголосовали!</div>
                                <div>Результаты голосования отправлены!</div>
                                <div className="mt-14">
                                    <Button title="Вернуться на главную" onClick={() => { navigate(-1) }} color="yellow" />
                                </div>
                            </div>
                            : <div className="flex flex-col items-center justify-center">
                                <div>Вы уверены, что хотите отправить результаты голосования?</div>
                                <div>После отправки дальнейшие изменения невозможны.</div>
                                <div className="flex justify-between gap-24 mt-14">
                                    <Button title="Отменить" onClick={() => { setIsOpenModal(false) }} color="empty" />
                                    <Button title="Отправить результаты" onClick={() => { handleSendResult() }} color="yellow" />
                                </div>
                            </div>
                        }

                    </Modal>}

                </div>}
        </>
    )
}