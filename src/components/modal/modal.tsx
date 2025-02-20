import React, { useEffect } from "react";

interface IModalProps {
    children: React.ReactNode;
    onClose: () => void;
    visible: boolean;
    type?: 'message' | 'warning'
}

export const Modal = (props: IModalProps) => {
    const {
        children,
        onClose,
        visible } = props

    const onKeydown = ({ key }: KeyboardEvent) => {
        switch (key) {
            case 'Escape':
                onClose()
                break
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    })

    if (!visible) return null

    return (
        <div className="fixed 
                        w-full 
                        h-full 
                        bg-[#303030BF]
                        top-0
                        left-0
                        z-[9999]
                        flex
                        justify-center
                        items-center
                        "
            onClick={onClose}
        >
            <div className={`
                            ${props.type === 'message' 
                                ? ' w-[811px] bg-(--color-button-active)' 
                                : 'w-[577px] bg-white'}
                            outline-[0.5px]
                            outline-black
                            rounded-2xl
                            p-7
                            
                            `}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};