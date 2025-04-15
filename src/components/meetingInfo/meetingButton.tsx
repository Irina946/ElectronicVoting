import { Button } from "../../components/button/button";

interface MeetingActionsProps {
    status: number;
    isRegister: boolean;
    onRegisterClick: () => void;
    onVotingClick: () => void;
    onBroadcastClick: () => void;
    onResultsClick: () => void;
    onRecordingClick: () => void;
    meetingURL: string | null,
    earlyRegistration: boolean | null
}

const MeetingActions: React.FC<MeetingActionsProps> = ({
    status,
    isRegister,
    onRegisterClick,
    onVotingClick,
    onBroadcastClick,
    onResultsClick,
    onRecordingClick,
    meetingURL,
    earlyRegistration
}) => {
    const getStatusText = (status: number) => {
        switch (status) {
            case 1:
                return "Регистрация ожидается";
            case 2:
                return "Разрешена регистрация";
            case 3:
                return "Разрешено голосование";
            case 4:
                return "Голосование завершено";
            case 5:
                return "Собрание завершено";
            default:
                return "";
        }
    };

    return (
        <div>
            {status !== 3 && (earlyRegistration === null || !earlyRegistration) ?
                <button
                    className="mb-7 text-2xl underline"
                    disabled={true}
                >
                    Досрочная решистрация запрещена
                </button>
                :
                <button
                    className="mb-7 text-2xl underline cursor-pointer"
                    onClick={onRegisterClick}
                    disabled={(status !== 2 && status !== 3) || isRegister}
                >
                    {getStatusText(status)}
                </button>
            }
            {/* Действия в зависимости от статуса */}
            {status === 1 && (
                <div className="flex gap-7 mb-7 text-sm w-[961px]">
                    <Button title="Проголосовать" color="yellow" onClick={onVotingClick} disabled={true} />
                    <Button title="Трансляция собрания" color="yellow" onClick={onBroadcastClick} disabled={true} />
                </div>
            )}

            {(status === 2 || status === 3) && (
                <div className="flex gap-7 mb-7 text-sm w-[961px]">
                    <Button
                        title="Проголосовать"
                        color="yellow"
                        onClick={onVotingClick}
                        disabled={!isRegister}
                    />
                    <Button
                        title="Трансляция собрания"
                        color="yellow"
                        onClick={onBroadcastClick}
                        disabled={!isRegister || meetingURL !== null}
                    />
                </div>
            )}

            {status === 4 && (
                <div className="flex gap-7 mb-7 text-sm w-[961px]">
                    <Button title="Результаты" color="yellow" onClick={onResultsClick} disabled={true} />
                    <Button title="Запись собрания" color="yellow" onClick={onRecordingClick} disabled={true} />
                </div>
            )}

            {status === 5 && (
                <div className="flex gap-7 mb-7 text-sm w-[961px]">
                    <Button title="Результаты" color="yellow" onClick={onResultsClick} disabled={false} />
                    <Button title="Запись собрания" color="yellow" onClick={onRecordingClick} disabled={meetingURL === null} />
                </div>
            )}
        </div>
    );
};

export default MeetingActions;
