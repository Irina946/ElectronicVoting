import { JSX } from "react";
import { IResult, Results } from "../../../components/informations/results";
import { useLocation } from "react-router";

const results: IResult[] = [
    {
        id: 19,
        results: [
            {
                detailId: null,
                for: 1,
                against: null,
                abstain: null
            }
        ]
    },
    {
        id: 20,
        results: [
            {
                detailId: 4,
                for: 1,
                against: null,
                abstain: null
            },
            {
                detailId: 5,
                for: null,
                against: null,
                abstain: 1
            },
            {
                detailId: 6,
                for: null,
                against: null,
                abstain: 1
            }
        ]
    }
]

export const ResultUser = (): JSX.Element => {

    const location = useLocation();
    const name = location.state

    return (
        <div className="w-[1016px] m-auto min-h-[280px]">
            <h1 className="text-[32px] text-(--color-text) mt-[26px] mb-[20px]">
                Результаты акционера {name}
            </h1>
            <div className="mb-7">
                <Results endTime={new Date("2025-03-18T23:59:59")} results={results} />
            </div>

        </div>
    )
}