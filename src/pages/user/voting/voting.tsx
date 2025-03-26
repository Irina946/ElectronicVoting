import { JSX, useState } from "react";
import { IAgenda } from "../../../components/row/row";
import { RowVotingOne } from "../../../components/rowVoting/rowVotingOne";
import { RowVotingNotCandidates } from "../../../components/rowVoting/rowVotingNotCandidates";
import { RowVotingCandidatesCumulative } from "../../../components/rowVoting/rowVotingCandidatesCumulative";
import { RowVotingCandidates } from "../../../components/rowVoting/rowVotingCandidates";

const agendaArray: IAgenda[] = [
    {
        number: 1,
        question: 'Утверждение порядка ведения годового общего собрания акционеров.',
        candidates: [],
        solution: ' Утверждение порядка ведения годового общего собрания акционеров.',
        materials: [],
        cumulativeVotes: false
    },
    {
        number: 2,
        question: 'Утверждение годовой бухгалтерской отчётности Общества, в том числе отчётов о прибылях и убытках (счётов прибылей и убытков) за 2023 год.',
        candidates: [],
        solution: 'Утверждение годовой бухгалтерской отчётности Общества, в том числе отчётов о прибылях и убытках (счётов прибылей и убытков) за 2023 год.',
        materials: [],
        cumulativeVotes: false
    },
    {
        number: 3,
        question: 'Избрание Совета директоров Общества.',
        candidates: [
            'Кузнецов Сергей Сергеевич',
            'Михайлов Михаил Михайлович',
            'Петров Петр Петрович',
            'Олегов Олег Олегович',
            'Степанов Степан Степанович'
        ],
        solution: 'Избрать членов Совета директоров общества следующим составом:',
        materials: [],
        cumulativeVotes: true
    },
    {
        number: 4,
        question: 'Избрание членов Ревизионной комиссии (Ревизора) Общества.',
        candidates: [
            'Иванов Иван Иванович',
            'Петров Петр Петрович',
            'Сидоров Сидор Сидорович',
        ],
        solution: ' Избрать ревизионную комиссию в составе:',
        materials: [],
        cumulativeVotes: false
    }
];

export const Voting = (): JSX.Element => {
    const [votes, setVotes] = useState<{ [key: number]: string | { [candidate: string]: number | string } }>({});

    const handleVoteChange = (agendaNumber: number, vote: string | { [candidate: string]: number | string }) => {
        setVotes(prev => ({ ...prev, [agendaNumber]: vote }));
    };

    console.log(votes)

    return (
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
                    ГОДОВОЕ ОБЩЕЕ СООБРАНИЕ АКЦИОНЕРОВ
                </p>
                <p className="font-bold text-center pb-6">
                    Акционерное общество "Ведение реестров компаний"
                </p>
                <div className="flex justify-between">
                    <div className="flex gap-3.5 items-center">
                        <div>
                            Дата, время окончания приёма бюллетеней:
                        </div>
                        <div className="bg-white py-[5px] px-2 ">
                            29.04.2024
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
                <div className="flex gap-3.5 items-center">
                    <div>
                        Количество голосующих акций:
                    </div>
                    <div className="bg-white py-[5px] px-2 ">
                        100
                    </div>
                </div>
                {agendaArray.map((agenda: IAgenda) => (
                    <>
                        {
                            agenda.candidates.length === 0 && agenda.number === 1 &&
                            <RowVotingOne agenda={agenda} onVoteChange={handleVoteChange} key={agenda.number} />
                        }
                        {
                            agenda.candidates.length === 0 && agenda.number !== 1 &&
                            <RowVotingNotCandidates agenda={agenda} onVoteChange={handleVoteChange} key={agenda.number} />
                        }
                        {
                            agenda.candidates.length !== 0 && agenda.number !== 1 && agenda.cumulativeVotes &&
                            <RowVotingCandidatesCumulative agenda={agenda} onVoteChange={handleVoteChange} totalVotes={500} key={agenda.number} />
                        }
                        {
                            agenda.candidates.length !== 0 && agenda.number !== 1 && !agenda.cumulativeVotes &&
                            <RowVotingCandidates agenda={agenda} key={agenda.number} onVoteChange={handleVoteChange}/>
                        }
                    </>
                ))}
            </div>
        </div>
    )
}