import { JSX } from "react";
import arrow from "../../assets/arrowCheckbox.svg"

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const Checkbox = (props: CheckboxProps): JSX.Element => {
    const { checked, onChange } = props;

    const handleToggle = () => {
        onChange(!checked);
    }

    return (
        <label>
            <input
                type="checkbox"
                checked={checked}
                onChange={handleToggle}
                className="hidden"
                />
                <div className={`bg-(--color-white) 
                                w-[28px] 
                                h-[28px]
                                relative
                                flex-shrink-0
                                `}>
                    {checked && (
                        <img src={arrow} alt="Arrow" className="absolute inset-0 mt-[5px] ml-[4px] w-[20px] h-[18px] text-white"/>
                    )}
                </div>
        </label>

    );
};