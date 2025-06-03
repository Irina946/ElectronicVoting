interface MeetingActionsProps {
    status: number;
    isRegister: boolean;
    onRegisterClick: () => void;
}

const MeetingActions: React.FC<MeetingActionsProps> = ({
    status,
    isRegister,
    onRegisterClick,
}) => {

    const getMeetingStatusText = (status: number) => {
        switch (status) {
            case 1:
                return "Ожидание регистрации";
            case 2:
                return "Регистрация открыта";
            case 3:
                return "Голосование открыто";
            case 4:
                return "Голосование завершено";
            case 5:
                return "Собрание завершено";
            default:
                return "";
        }
    };

    return (
        <div className="mt-[20px]">
            {/* Отображение регистрации */}
            <div className="mb-2">
                <span className="inline-block text-(--color-text) font-medium text-2xl">
                    {getMeetingStatusText(status)}
                </span>
            </div>

            {/* Кнопка регистрации */}
            {(status === 2 || status === 3) && (
                <div className="mb-6">
                    <button
                        className={`text-2xl underline 
                            ${isRegister
                            ? "text-(--color-green) cursor-not-allowed"
                            : status !== 2
                                ? "text-red-500 cursor-not-allowed"
                                : "cursor-pointer text-(--color-blue-message)"
                            } `}
                        onClick={onRegisterClick}
                        disabled={isRegister || status === 3}
                    >
                        {isRegister
                            ? "Вы зарегистрированы"
                            : status !== 2
                                ? "Регистрация не пройдена"
                                : "Зарегистрироваться"
                        }
                    </button>
                </div>
            )}
        </div>
    );
};

export default MeetingActions;
