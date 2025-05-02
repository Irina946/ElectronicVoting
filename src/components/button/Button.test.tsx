import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders button with correct title', () => {
        render(<Button title="Test Button" onClick={mockOnClick} color="yellow" />);
        expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        render(<Button title="Test Button" onClick={mockOnClick} color="yellow" />);
        fireEvent.click(screen.getByText('Test Button'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('applies correct class for yellow color', () => {
        render(<Button title="Test Button" onClick={mockOnClick} color="yellow" />);
        const button = screen.getByText('Test Button');
        expect(button.className).toContain('buttonYellow');
    });

    it('applies correct class for empty color', () => {
        render(<Button title="Test Button" onClick={mockOnClick} color="empty" />);
        const button = screen.getByText('Test Button');
        expect(button.className).toContain('buttonEmpty');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button title="Test Button" onClick={mockOnClick} color="yellow" disabled={true} />);
        const button = screen.getByText('Test Button');
        expect(button).toBeDisabled();
        expect(button.className).toContain('disabled');
    });

    it('is not disabled by default', () => {
        render(<Button title="Test Button" onClick={mockOnClick} color="yellow" />);
        const button = screen.getByText('Test Button');
        expect(button).not.toBeDisabled();
    });
}); 