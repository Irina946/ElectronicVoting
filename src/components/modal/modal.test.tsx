import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './modal';

describe('Modal Component', () => {
    const mockOnClose = jest.fn();
    const testContent = 'Test Modal Content';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders nothing when visible is false', () => {
        const { container } = render(
            <Modal visible={false} onClose={mockOnClose}>
                {testContent}
            </Modal>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders content when visible is true', () => {
        render(
            <Modal visible={true} onClose={mockOnClose}>
                {testContent}
            </Modal>
        );
        expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('calls onClose when clicking outside the modal', () => {
        const { container } = render(
            <Modal visible={true} onClose={mockOnClose}>
                {testContent}
            </Modal>
        );
        const overlay = container.querySelector('.fixed');
        if (overlay) {
            fireEvent.click(overlay);
            expect(mockOnClose).toHaveBeenCalled();
        }
    });

    it('does not call onClose when clicking inside the modal', () => {
        const { container } = render(
            <Modal visible={true} onClose={mockOnClose}>
                {testContent}
            </Modal>
        );
        const modalContent = container.querySelector('.rounded-2xl');
        if (modalContent) {
            fireEvent.click(modalContent);
            expect(mockOnClose).not.toHaveBeenCalled();
        }
    });

    it('calls onClose when pressing Escape key', () => {
        render(
            <Modal visible={true} onClose={mockOnClose}>
                {testContent}
            </Modal>
        );
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('applies correct styles for message type', () => {
        const { container } = render(
            <Modal visible={true} onClose={mockOnClose} type="message">
                {testContent}
            </Modal>
        );
        const modalContent = container.querySelector('.rounded-2xl');
        expect(modalContent?.className).toContain('w-[811px]');
        expect(modalContent?.className).toContain('bg-(--color-button-active)');
    });

    it('applies correct styles for warning type', () => {
        const { container } = render(
            <Modal visible={true} onClose={mockOnClose} type="warning">
                {testContent}
            </Modal>
        );
        const modalContent = container.querySelector('.rounded-2xl');
        expect(modalContent?.className).toContain('w-[577px]');
        expect(modalContent?.className).toContain('bg-white');
    });
}); 