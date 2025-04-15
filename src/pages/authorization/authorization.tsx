import { JSX, useState } from "react";
import { InputAuthorization } from "../../components/input/inputAuthorization";
import { useNavigate } from "react-router";
import { login } from "../../auth/auth";


const validateInput = (value: string): string | null => {
    const isPhone = /^\+7\d{10}$/.test(value);
    const isLogin = /^[a-zA-Z0-9_]{4,30}$/.test(value);

    if (value === '') {
        return 'Поле не должно быть пустым';
    }

    if (!isPhone && !isLogin) {
        return 'Введите корректный номер телефона или логин';
    }

    return null;
};


export const Authorization = (): JSX.Element => {

    const [isPasswordView, setIsPasswordView] = useState(false)
    const [number, setNumber] = useState('')
    const [password, setPassword] = useState('')
    const [numberError, setNumberError] = useState<string | undefined>(undefined);
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);
    const navigate = useNavigate()

    const handleClickButton = async () => {
        const numberValidationError = validateInput(number);
        const passwordValidationError = password === '' ? 'Введите пароль' : undefined;

        setNumberError(numberValidationError || undefined);
        setPasswordError(passwordValidationError);
        setGeneralError(undefined);

        if (numberValidationError || passwordValidationError) return;

        try {
            const result = await login(number, password);

            if (result.success) {
                navigate(result.isStaff ? '/admin' : '/user');
                window.location.reload();
            } else {
                setGeneralError('Неверный номер телефона или пароль');
            }
        } catch (error) {
            setGeneralError(`Ошибка при входе: ${error}`);
        }
    }


    return (
        <div className="w-[35%] m-auto mt-20 flex flex-col">
            <div className="text-[2vw] text-(--color-text-authorization) font-bold my-9">
                Войти
            </div>
            <InputAuthorization
                value={number}
                onChange={(value) => { setNumber(value) }}
                type="text"
                label="Номер Телефона или Логин:"
                error={numberError}
                fieldType="login"
            />
            <div className="flex flex-col items-start">
                <InputAuthorization
                    value={password}
                    onChange={(value) => { setPassword(value) }}
                    type={isPasswordView ? "text" : "password"}
                    label="Пароль:"
                    error={passwordError}
                    fieldType="password"
                />
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
                {generalError ? <div className="text-red-600 text-sm">{generalError}</div> : <></>}
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