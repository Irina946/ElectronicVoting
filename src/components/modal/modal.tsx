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
        
        // При открытии модального окна
        if (visible) {
            // Прокручиваем страницу в самый верх
            window.scrollTo(0, 0);
            // Запрещаем прокрутку body
            document.body.style.overflow = 'hidden';
        } else {
             // Восстанавливаем прокрутку при закрытии
            document.body.style.overflow = '';
        }
        
        // Очистка при размонтировании
        return () => {
            document.removeEventListener('keydown', onKeydown);
            document.body.style.overflow = ''; // Убедиться, что overflow сброшен при unmount
        };
    }, [onKeydown, visible]); // Добавляем visible в зависимости для реакции на его изменение

    // Используем классы для управления видимостью вместо условного рендеринга
    const modalClasses = [
        'fixed',
        'w-full',
        'h-screen',
        'bg-[#303030BF]',
        'top-0',
        'left-0',
        'z-[9999]',
        'mt-[-220px]',
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
        visible ? 'translate-y-0' : 'translate-y-8', // Анимация появления снизу
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