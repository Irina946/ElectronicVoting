import { JSX } from "react";

export const TableHeader = (): JSX.Element => {
    return (
        <div className="
            bg-white
            border-[0.5px]
            border-(--color-black)
            grid
            grid-cols-[36px_532px_133px_133px_126px]
            mb-[-1px]
        ">
            <div className="px-3.5 border-r-[0.5px] flex items-center justify-center font-bold">
                №
            </div>
            <div className="p-3.5 border-r-[0.5px] font-bold text-center">
                Вопрос / Решение
            </div>
            <div className="p-3.5 border-r-[0.5px] font-bold text-center">
                ЗА
            </div>
            <div className="p-3.5 border-r-[0.5px] font-bold text-center">
                ПРОТИВ
            </div>
            <div className="p-3.5 font-bold text-center">
                ВОЗДЕРЖАЛСЯ
            </div>
        </div>
    );
}; 