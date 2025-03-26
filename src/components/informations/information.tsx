import { JSX } from "react"

export const Information = (): JSX.Element => {
    return (
        <div className="
                        bg-(--color-gray)
                        border-(--color-text)
                        border-[1px]
                        rounded-2xl
                        p-7
                        text-sm
                        ">
            <div className="flex flex-col items-center mb-3.5">
                <div className="font-bold">Информация</div>
                <div className="w-[331px] text-center">
                    о проведении годового общего собрания акционеров Акционерного общества «Предприятие №1»
                </div>
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
        </div>
    )
}