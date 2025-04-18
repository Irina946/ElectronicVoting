import { JSX, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Alert } from "../../../components/modal/alert";
import { getAccounts, getMeetingForId, postRegister } from "../../../requests/requests";
import { IMeeting, IUsersInMeeting } from "../../../requests/interfaces";
import { Modal } from "../../../components/modal/modal";
import { ButtonAccounts } from "../../../components/button/buttonAccounts";
import { ButtonMessageAdmin } from "../../../components/button/buttonMessageAdmin";
import { AxiosError } from "axios";
import { MeetingInfo } from "../../../components/meetingInfo/meetingInfo";
import { getNameCompany } from "../../../utils/functions";
import MeetingActions from "../../../components/meetingInfo/meetingButton";

export const Message = (): JSX.Element => {
    const [isRegister, setIsRegister] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const [informationMeeting, setInformationMeeting] = useState<IMeeting>()
    const [accaunts, setAccaunts] = useState<IUsersInMeeting[]>()
    const [selectedAccaunt, setSelectedAccaunt] = useState<IUsersInMeeting>({
        account_id: 0,
        account_fullname: ''
    })
    const [errorRegister, setErrorRegister] = useState<string>('')

    const idMeeting: { id: number } = location.state

    const handleClickRegister = async () => {
        const register = async () => {
            try {
                const data = await postRegister(idMeeting.id)
                setIsRegister(data.message === 'Вы успешно зарегистрированы на собрание.');
                setIsOpenAlert(data.message === 'Вы успешно зарегистрированы на собрание.');
                setErrorRegister("");
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.log(error)
                    setErrorRegister(error.response?.data?.error || error.message)
                } else if (error instanceof Error) {
                    setErrorRegister(error.message);
                }
                setIsOpenAlert(true);
            }
        };
        register()

        setTimeout(() => {
            setIsOpenAlert(false)
        }, 5000)
    }

    useEffect(() => {
        const getMeeting = async () => {
            try {
                const data = await getMeetingForId(idMeeting.id)
                setIsRegister(data.is_registered || false)
                setInformationMeeting(data);
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getMeeting()
    }, [idMeeting]);

    const handleCloseAlert = () => {
        setIsOpenAlert(false)
    };

    const handleClickBroadcast = () => {
        navigate(`/user/meeting/${idMeeting.id}/broadcast`)
    }

    const handleClickModalOpen = () => {
        setIsOpenModal(true);
        const getUsers = async () => {
            try {
                const data = await getAccounts(idMeeting.id)
                setAccaunts(data.accounts)
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getUsers()
    }

    const handleClickVoting = (userId: number) => {
        const id = idMeeting.id
        navigate(`/user/meeting/${id}/voting/${userId}`, { state: { id, userId } })
    }

    const handleClickResult = (userId: number, userName: string) => {
        const id = idMeeting.id
        navigate(`/user/meeting/${id}/result/${userId}`, { state: { id, userId, userName } })
    }

    return (
        <div className="w-[1016px] m-auto">
            <h1 className="text-[32px] text-(--color-text) my-7">
                Сообщение о проведении собрания
            </h1>
            {informationMeeting === undefined ? (<div className="flex justify-center items-center m-auto">
                <div className="loader"></div>
            </div>) : <>
                <MeetingActions
                    status={informationMeeting.status}
                    isRegister={isRegister}
                    onRegisterClick={handleClickRegister}
                    onVotingClick={handleClickModalOpen}
                    onBroadcastClick={handleClickBroadcast}
                    onResultsClick={handleClickModalOpen}
                    onRecordingClick={() => { }}
                    meetingURL={informationMeeting.meeting_url}
                    earlyRegistration={informationMeeting.early_registration}
                />
                <MeetingInfo informationMeeting={informationMeeting} nameCompany={getNameCompany(informationMeeting.issuer.short_name || '')} />
            </>}
            {isOpenAlert &&
                <Alert
                    message={errorRegister !== 'Регистрация не разрешена'
                        ? 'Регистрация уже окончена'
                        : "Регистрация пройдена"}
                    onClose={handleCloseAlert}
                />
            }
            {isOpenModal &&
                <Modal onClose={() => setIsOpenModal(false)} visible={isOpenModal}>
                    <div className="flex flex-col items-center ">
                        <div className="text-base text-(--color-red) font-bold mb-7">
                            Выберите лицевой счет
                        </div>
                        <div className="flex flex-col items-start gap-4 mb-7">
                            {accaunts?.map((account) => (
                                <ButtonAccounts
                                    fullName={account.account_fullname}
                                    onClick={() => setSelectedAccaunt(account)}
                                    key={account.account_id}
                                />
                            ))}

                        </div>
                        <ButtonMessageAdmin
                            title="Выбрать"
                            onClick={() => (
                                informationMeeting?.status === 5
                                    ? handleClickResult(selectedAccaunt?.account_id, selectedAccaunt?.account_fullname)
                                    : handleClickVoting(selectedAccaunt?.account_id)
                            )
                            }
                            isSelected={false}
                        />
                    </div>
                </Modal>
            }

        </div>
    )
}