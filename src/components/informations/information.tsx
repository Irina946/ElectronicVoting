import { JSX } from "react"
import { IAgenda, IMeeting } from "../../requests/interfaces"

interface IInformation {
    data: IMeeting | null
}

const formatDate = (dateString: string): string => {
    if (dateString === '') return ''
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

const formatDateWithTime = (dateString: string): string => {
    if (dateString === '') return ''
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

export const Information = (props: IInformation): JSX.Element => {
    const data = props.data;
    const nameCompany = data?.issuer.short_name.slice(0, 2) === 'АО' ? data?.issuer.short_name.slice(3) : data?.issuer.short_name

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
                    о проведении {data?.annual_or_unscheduled
                        ? 'годового'
                        : 'внеочередного'} {data?.first_or_repeated
                            ? ''
                            : 'повторного'} общего собрания акционеров Акционерного общества {
                        nameCompany
                    }
                </div>
            </div>
            <div className="mb-3.5 indent-3">
                В соответствии с решением Совета директоров Акционерного общества {nameCompany} (место нахождения Общества:
                {data?.issuer.address.slice(0, -8)}) от {formatDate(data?.decision_date || '')} уведомляем Вас о проведении {data?.annual_or_unscheduled
                    ? 'годового'
                    : 'внеочередного'} {data?.first_or_repeated
                        ? ''
                        : 'повторного'} общего собрания акционеров {
                    data?.meeting_name
                } в форме собрания ({data?.meeting_name !== null ? 'совместного присутствия' : 'удаленного присутствия'}) со следующей повесткой дня:
            </div>
            <ol className="mb-3.5 list-decimal ml-3">
                {data ? data.agenda.map((el: IAgenda) => (
                    <li key={el.question_id} className="indent-1">
                        {el.question}
                    </li>
                )) : <li></li>}
            </ol>
            <div className="mb-3.5 indent-3">
                Дата и время проведения годового общего собрания акционеров:
                <div className="font-bold">{formatDateWithTime(data?.meeting_open || '')}</div>
            </div>
            <div className="mb-3.5 flex indent-3">
                <div>Место проведения годового общего собрания акционеров:</div>
                <div className="font-bold">
                    {data?.meeting_location}
                </div>
            </div>
            <div className="mb-3.5 flex indent-3">
                <div>Дата определения (фиксации) лиц, имеющих право на участие в годовом общем собрании акционеров:</div>
                <div className="font-bold">
                    {formatDate(data?.record_date || '')}
                </div>
            </div>
            <div className="mb-3.5 flex indent-3">
                <div>Дата, время окончания приёма бюллетеней:</div>
                <div className="font-bold">
                    {formatDateWithTime(data?.deadline_date || '')}
                </div>
            </div>
            <div className="mb-3.5 indent-3">
                Информация (материалы) предоставляются для ознакомления лицам, имеющим право на участие в {data?.annual_or_unscheduled
                    ? 'годовом'
                    : 'внеочередном'} {data?.first_or_repeated
                        ? ''
                        : 'повторном'} общем собрании акционеров Общества в сообщении о проведении собрания по ссылке «<u><b>Материалы собрания</b></u>», а также в день
                проведения {data?.annual_or_unscheduled
                    ? 'годового'
                    : 'внеочередного'} {data?.first_or_repeated
                        ? ''
                        : 'повторного'} общего собрания акционеров по месту и во время его проведения.
            </div>
            <div className="mb-7 indent-3 text-(--color-red) font-bold underline cursor-pointer">
                Материалы собрания
            </div>
        </div>
    )
}