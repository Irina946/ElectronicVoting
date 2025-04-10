import { JSX, useState } from "react";
import { InputAuthorization } from "../../components/input/inputAuthorization";
import { useNavigate } from "react-router";
import { login } from "../../auth/auth";

export const Authorization = (): JSX.Element => {

    const [isPasswordView, setIsPasswordView] = useState(false)
    const [number, setNumber] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | undefined>(undefined)
    const navigate = useNavigate()

    const handleClickButton = async () => {
        if (number === '') {
            setError('Введите номер телефона')
        }
        if (password === '') {
            setError('Введите пароль')
        }
        try {
            const result = await login(number, password); // Ждём результат логина

            if (result.success) {
                if (result.isStaff) {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }

                window.location.reload();
            } else {
                setError('Неверный номер телефона или пароль');
            }
        } catch (error) {
            setError(`Ошибка при входе: ${error}`);
        }
    }


    return (
        <div className="w-[35%] m-auto mt-20 flex flex-col">
            <div className="text-[2vw] text-(--color-text-authorization) font-bold my-9">
                Войти
            </div>
            <InputAuthorization value={number} onChange={(value) => { setNumber(value) }} type="text" label="Номер Телефона:" />
            <div className="flex flex-col items-start">
                <InputAuthorization value={password} onChange={(value) => { setPassword(value) }} type={isPasswordView ? "text" : "password"} label="Пароль:" />
                <button className="-mt-7 self-end mr-[20%] cursor-pointer group"
                    onClick={() => setIsPasswordView(!isPasswordView)}
                >
                    <svg
                        width="26"
                        height="14"
                        viewBox="0 0 26 14"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M1 7.49998C6 -0.617103 18.5 -1.69936 25 7.5" stroke="gray" className="group-hover:stroke-gray-300" />
                        <path d="M1 6.98C6 15.0971 18.5 16.1793 25 6.97998" stroke="gray" className="group-hover:stroke-gray-300" />
                        <circle cx="13" cy="7.20001" r="5" stroke="gray" strokeWidth="2" className="group-hover:stroke-gray-300" />
                        <circle cx="11.75" cy="6.15002" r="1.25" fill="gray" className="group-hover:fill-gray-300" />
                    </svg>
                </button>
                {error ? <div className="text-red-600 text-sm">{error}</div> : <></>}
            </div>
            <button
                className="cursor-pointer self-end mr-[20%] mt-14 border-[5px] border-[#8b8a8a] rounded-[10px] w-[125px] h-16 hover:border-orange-400"
                onClick={handleClickButton}
            >
                Войти
            </button>

        </div>
    )
}