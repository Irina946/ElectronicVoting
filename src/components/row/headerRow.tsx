import { JSX } from "react";

export const HeaderRow = (): JSX.Element => {
    return (
        <div className="
                                            grid 
                                            grid-cols-[42px_112px_232px_165px_257px_149px] 
                                            w-[962px] 
                                            h-[42px]
                                            align-middle
                                            text-left     
                                            gap-x-[1px]  
                                            bg-white                             
                                            ">
            <div className="w-[42px] h-[42px] outline-[0.5px] ">

            </div>
            <div className="outline-[0.5px] pl-[10px] flex items-center">
                Номер вопроса
            </div>
            <div className="outline-[0.5px] pl-[10px] flex items-center">
                Вопрос
            </div>
            <div className="outline-[0.5px] pl-[10px] flex items-center">
                Кандидаты/подвопросы
            </div>
            <div className="outline-[0.5px] pl-[10px] flex items-center">
                Решение
            </div>
            <div className="outline-[0.5px] pl-[10px] flex items-center">
                Кумулятивные голоса
            </div>
        </div>
    )
}