import { JSX, useState } from "react"
import { Button } from "../../../components/button/button"
import { useNavigate } from "react-router"
import { Alert } from "../../../components/modal/alert";

export const Message = (): JSX.Element => {
    const [isRegister, setIsRegister] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(false)
    const navigate = useNavigate();

    const handleClickRegister = () => {
        setIsRegister(true)
        setIsOpenAlert(true)

        setTimeout(() => {
            setIsOpenAlert(false)
        }, 5000)
    }

    const handleCloseAlert = () => {
        setIsOpenAlert(false)
    };

    const handleClickBroadcast = () => {
        navigate('/mailShareholder/broadcast')
    }

    const handleClickVoting = () => {
        navigate('/mailShareholder/message/voting')
    }

    return (
        <div className="w-[1016px] m-auto">
            <h1 className="text-[32px] text-(--color-text) my-7">
                Сообщение о проведении собрания
            </h1>
            {isRegister
                ? <button
                    className="mb-7
                                text-2xl
                                underline
                                
                
                "
                    disabled
                >
                    Регистрация пройдена
                </button>
                : <button
                    className="mb-7
                                text-2xl
                                underline
                                cursor-pointer
                                hover:text-(--color-red)
                "
                    onClick={handleClickRegister}
                >
                    Зарегестрироваться на собрание
                </button>}
            <div className="flex gap-7 mb-7 text-sm w-[961px]">
                <Button title='Проголосовать' color='yellow' onClick={() => handleClickVoting()} disabled={!isRegister} />
                <Button title='Трансляция собрания' color='yellow' onClick={() => handleClickBroadcast()} disabled={!isRegister} />
            </div>
            <div className="
                            w-[1016px] 
                            p-7 rounded-2xl 
                            bg-(--color-gray) 
                            outline-[0.5px] 
                            outline-(--color-text) 
                            text-sm 
                            text-(--color-text)
                            mb-7
                            text-justify
                            ">
                <div className="flex flex-col items-center mb-3.5">
                    <div className="font-bold">Сообщение</div>
                    <div className="w-[331px] text-center">
                        о проведении годового общего собрания акционеров Акционерного общества «Предприятие №1»
                    </div>
                </div>
                <div className="font-bold mb-3.5 text-center">
                    УВАЖАЕМЫЙ АКЦИОНЕР!
                </div>
                <div className="mb-3.5 indent-3">
                    В соответствии с решением Совета директоров Акционерного общества «Предприятие №1» (место нахождения Общества: Россия, Свердловская область,
                    город Екатеринбург ул. 8 марта д. 72) от 21 марта 2024г. уведомляем Вас о проведении  годового общего собрания акционеров
                    Акционерного общества «Предприятие №1» в форме собрания (совместного присутствия) со следующей повесткой дня:
                </div>
                <ol className="mb-8">

                </ol>
                <div className="mb-3.5 indent-3">
                    Дата и время проведения годового общего собрания акционеров:
                    <div className="font-bold">30 april</div>
                </div>
                <div className="mb-3.5 flex indent-3">
                    <div>Место проведения годового общего собрания акционеров:</div>
                    <div className="font-bold">
                        Свердловская область, г.Екатеринбург ул.8 марта д.72
                    </div>
                </div>
                <div className="mb-3.5 flex indent-3">
                    <div>Дата определения (фиксации) лиц, имеющих право на участие в годовом общем собрании акционеров:</div>
                    <div className="font-bold">
                        1 april
                    </div>
                </div>
                <div className="mb-3.5 flex indent-3">
                    <div>Дата, время окончания приёма бюллетеней:</div>
                    <div className="font-bold">
                        1 april
                    </div>
                </div>
                <div className="mb-3.5 indent-3">
                    Информация (материалы) предоставляются для ознакомления лицам, имеющим право на участие в годовом общем собрании
                    акционеров Общества в сообщении о проведении собрания по ссылке «<u><b>Материалы собрания</b></u>», а также в день
                    проведения годового общего собрания акционеров по месту и во время его проведения.
                </div>
                <div className="mb-7 indent-3 text-(--color-red) font-bold underline cursor-pointer">
                    Материалы собрания
                </div>
                <div className="mb-3.5 indent-3">
                    Совет директоров АО «Предприятие №1»
                </div>
                <div className="flex items-end flex-col">
                    <div className="mb-3.5 w-[400px]">
                        Утверждено на заседании Совета Директоров (протокол заседания Совета Директоров от 25.02.2024г)
                    </div>
                    <div className="mb-3.5 w-[400px]">
                        Секретарь Совета Директоров ________________ И.И.Иванов
                    </div>
                </div>

            </div>
            {isOpenAlert &&
                <Alert message="Регистрация пройдена" onClose={handleCloseAlert} />
            }
        </div>
    )
}