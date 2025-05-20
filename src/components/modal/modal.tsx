import React, { useEffect, useCallback } from "react";

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

    const onKeydown = useCallback(({ key }: KeyboardEvent) => {
        switch (key) {
            case 'Escape':
                onClose();
                break;
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', onKeydown);
        
        // Предотвращаем прокрутку body при открытом модальном окне
        if (visible) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', onKeydown);
            // Восстанавливаем прокрутку при размонтировании
            document.body.style.overflow = '';
        };
    }, [onKeydown, visible]);

    // Используем классы для управления видимостью вместо условного рендеринга
    const modalClasses = [
        'fixed',
        'w-full',
        'h-full',
        'bg-[#303030BF]',
        'top-0',
        'left-0',
        'z-[9999]',
        'flex',
        'justify-center',
        'items-center',
        'transition-opacity',
        'duration-300',
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    ].join(' ');

    const modalContentClasses = [
        'outline-[0.5px]',
        'outline-black',
        'rounded-2xl',
        'p-7',
        'max-h-[90vh]',
        'overflow-y-auto',
        'transition-transform',
        'duration-300',
        visible ? 'translate-y-0' : 'translate-y-8',
        type === 'message' ? 'w-[811px] bg-(--color-button-active)' : 'w-[577px] bg-white'
    ].join(' ');

    return (
        <div 
            className={modalClasses}
            onClick={onClose}
            data-testid="modal-overlay"
            aria-hidden={!visible}
        >
            <div 
                className={modalContentClasses}
                onClick={(e) => e.stopPropagation()}
                data-testid="modal-content"
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>
    );
};