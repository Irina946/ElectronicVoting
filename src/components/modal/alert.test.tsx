import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from './alert';

describe('Alert Component', () => {
    const mockOnClose = jest.fn();
    const testMessage = 'Test Alert Message';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders message correctly', () => {
        render(<Alert message={testMessage} onClose={mockOnClose} />);
        expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<Alert message={testMessage} onClose={mockOnClose} />);
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('renders with correct styles', () => {
        const { container } = render(<Alert message={testMessage} onClose={mockOnClose} />);
        const alert = container.firstChild as HTMLElement;
        
        expect(alert).toHaveClass('fixed');
        expect(alert).toHaveClass('bottom-4');
        expect(alert).toHaveClass('right-4');
        expect(alert).toHaveClass('bg-[#30303075]');
        expect(alert).toHaveClass('w-[280px]');
        expect(alert).toHaveClass('h-[100px]');
    });

    it('renders close button with correct SVG', () => {
        render(<Alert message={testMessage} onClose={mockOnClose} />);
        const svg = screen.getByRole('button').querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '15');
        expect(svg).toHaveAttribute('height', '15');
    });
}); 