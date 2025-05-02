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
        visible,
        type = 'warning'
    } = props;

    const onKeydown = ({ key }: KeyboardEvent) => {
        switch (key) {
            case 'Escape':
                onClose();
                break;
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeydown);
        return () => document.removeEventListener('keydown', onKeydown);
    }, []);

    if (!visible) return null;

    const modalContentClasses = [
        'outline-[0.5px]',
        'outline-black',
        'rounded-2xl',
        'p-7',
        'max-h-[90vh]',
        'overflow-y-auto',
        type === 'message' ? 'w-[811px] bg-(--color-button-active)' : 'w-[577px] bg-white'
    ].join(' ');

    return (
        <div 
            className="fixed 
                w-full 
                h-full 
                bg-[#303030BF]
                top-0
                left-0
                z-[9999]
                flex
                justify-center
                items-center"
            onClick={onClose}
            data-testid="modal-overlay"
        >
            <div 
                className={modalContentClasses}
                onClick={(e) => e.stopPropagation()}
                data-testid="modal-content"
            >
                {children}
            </div>
        </div>
    );
};