interface InputProps {
    placeholder: string;
}

export const Input = (props: InputProps) => {
    const { placeholder } = props
    return <input
        type="text"
        placeholder={placeholder}
        className="w-[100%] 
                h-[28px] 
                py-[5px]
                px-[10px]
                bg-(--color-white) 
                text-sm 
                font-(--font-display) 
                placeholder-(--color-placeholder) 
                text-(--color-text)"
    />;
};