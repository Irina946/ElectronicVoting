import { IMeeting, IAgenda } from "../../requests/interfaces";
import { formatDate, formatDateWithTime } from "../../utils/functions";

interface MeetingInfoProps {
    informationMeeting?: IMeeting;
    nameCompany?: string;
}

export const MeetingInfo = ({ informationMeeting, nameCompany }: MeetingInfoProps) => {
    return (
        <div className="w-[1016px] p-7 rounded-2xl bg-(--color-gray) outline-[0.5px] outline-(--color-text) text-sm text-(--color-text) mb-7 text-justify">
            <div className="flex flex-col items-center mb-3.5">
                <div className="font-bold">Сообщение</div>
                <div className="w-[331px] text-center">
                    о проведении {informationMeeting?.annual_or_unscheduled ? 'годового' : 'внеочередного'} {informationMeeting?.first_or_repeated ? '' : 'повторного'} общего собрания акционеров Акционерного общества {nameCompany}
                </div>
            </div>
            <div className="font-bold mb-3.5 text-center">УВАЖАЕМЫЙ АКЦИОНЕР!</div>
            <div className="mb-3.5 indent-3">
                В соответствии с решением Совета директоров Акционерного общества {nameCompany} (место нахождения Общества: {informationMeeting?.issuer.address.slice(0, -8)}) от {formatDate(informationMeeting?.decision_date || '')} уведомляем Вас о проведении {informationMeeting?.annual_or_unscheduled ? 'годового' : 'внеочередного'} {informationMeeting?.first_or_repeated ? '' : 'повторного'} общего собрания акционеров {informationMeeting?.meeting_name} в форме собрания ({informationMeeting?.meeting_name !== null ? 'совместного присутствия' : 'удаленного присутствия'}) со следующей повесткой дня:
            </div>
            <ol className="mb-3.5 list-decimal ml-3">
                {informationMeeting?.agenda.map((el: IAgenda) => (
                    <li key={el.question_id} className="indent-1">{el.question}</li>
                ))}
            </ol>
            <div className="mb-3.5 indent-3">Дата и время проведения годового общего собрания акционеров:
                <div className="font-bold">{formatDateWithTime(informationMeeting?.meeting_open || '')}</div>
            </div>
            <div className="mb-3.5 flex indent-3">
                <div>Место проведения годового общего собрания акционеров:</div>
                <div className="font-bold">{informationMeeting?.meeting_location}</div>
            </div>
            <div className="mb-3.5 flex indent-3">
                <div>Дата определения (фиксации) лиц, имеющих право на участие в годовом общем собрании акционеров:</div>
                <div className="font-bold">{formatDate(informationMeeting?.record_date || '')}</div>
            </div>
            <div className="mb-3.5 flex indent-3">
                <div>Дата, время окончания приёма бюллетеней:</div>
                <div className="font-bold">{formatDateWithTime(informationMeeting?.deadline_date || '')}</div>
            </div>
            <div className="mb-3.5 indent-3">
                Информация (материалы) предоставляются для ознакомления лицам, имеющим право на участие в собрании по ссылке «<u><b>Материалы собрания</b></u>», а также в день проведения собрания по месту и во время его проведения.
            </div>
            <div className="mb-7 indent-3 text-(--color-red) font-bold underline cursor-pointer">Материалы собрания</div>
            <div className="mb-3.5 indent-3">Совет директоров АО {nameCompany}</div>
            <div className="flex items-end flex-col">
                <div className="mb-3.5 w-[400px]">Утверждено на заседании Совета Директоров (протокол заседания Совета Директоров от {formatDate(informationMeeting?.decision_date || '')})</div>
                <div className="mb-3.5 w-[400px]">Секретарь Совета Директоров ________________ И.И.Иванов</div>
            </div>
        </div>
    );
};
