import { JSX, useEffect, useState } from "react"
import { ButtonMessageAdmin } from "../../../components/button/buttonMessageAdmin"
import { Information } from "../../../components/informations/information";
import { Participants } from "../../../components/informations/participants";
import { IResult, Results } from "../../../components/informations/results";
import { useNavigate } from "react-router";

const results: IResult[] = [
    {
        id: 19,
        results: [
            {
                detailId: null,
                for: 1000,
                against: 400,
                abstain: 1000
            }
        ]
    },
    {
        id: 20,
        results: [
            {
                detailId: 4,
                for: 2400,
                against: 0,
                abstain: 0
            },
            {
                detailId: 5,
                for: 200,
                against: 1000,
                abstain: 1200
            },
            {
                detailId: 6,
                for: 0,
                against: 600,
                abstain: 1800
            }
        ]
    }
]

export const MessagePageAdmin = (): JSX.Element => {
    
    const navigate = useNavigate()

    const [currentType, setCurrentType] = useState<'information' | 'participants' | 'results'>(() => {
        const savedType = localStorage.getItem('informationType');
        return savedType as 'information' | 'participants' | 'results' || 'information';
    });

    useEffect(() => {
        localStorage.setItem('informationType', currentType);
    }, [currentType]);

    const handleButtonClick = (type: 'information' | 'participants' | 'results') => {
        setCurrentType(type);
    };

    const handleClickMessages = () => {
        navigate(-1)
    }

    return (
        <div className="w-[1016px] m-auto min-h-[280px]">
            <h1 className="text-[32px] text-(--color-text) mt-[26px] mb-[20px]">
                Информация о собрании
            </h1>
            <div className="mb-7 flex gap-7">
                <ButtonMessageAdmin
                    title="Все собрания"
                    onClick={() => handleClickMessages()}
                    isSelected={false}
                />
                <ButtonMessageAdmin
                    title="Информация"
                    onClick={() => handleButtonClick('information')}
                    isSelected={currentType === 'information'}
                />
                <ButtonMessageAdmin
                    title="Участники"
                    onClick={() => handleButtonClick('participants')}
                    isSelected={currentType === 'participants'}
                />
                <ButtonMessageAdmin
                    title="Результаты"
                    onClick={() => handleButtonClick('results')}
                    isSelected={currentType === 'results'}
                />
            </div>
            <div className="mb-7">
                {currentType === 'information' && <Information />}
                {currentType === 'participants' && <Participants endDate={new Date("2025-03-10T23:59:59")} />}
                {currentType === 'results' && <Results endTime={new Date("2025-03-18T23:59:59")} results={results}/>}
            </div>
        </div>
    )
}