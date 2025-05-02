import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './checkbox';

// Мокаем SVG импорт
jest.mock('../../assets/arrowCheckbox.svg', () => 'svg-mock');

describe('Checkbox Component', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders unchecked by default', () => {
        const { container } = render(<Checkbox checked={false} onChange={mockOnChange} />);
        const checkbox = container.querySelector('input[type="checkbox"]');
        expect(checkbox).not.toBeChecked();
    });

    it('renders checked when checked prop is true', () => {
        const { container } = render(<Checkbox checked={true} onChange={mockOnChange} />);
        const checkbox = container.querySelector('input[type="checkbox"]');
        expect(checkbox).toBeChecked();
    });

    it('calls onChange with correct value when clicked', () => {
        const { container } = render(<Checkbox checked={false} onChange={mockOnChange} />);
        const checkbox = container.querySelector('input[type="checkbox"]');
        
        if (checkbox) {
            fireEvent.click(checkbox);
            expect(mockOnChange).toHaveBeenCalledWith(true);
        }
    });

    it('calls onChange with false when clicked while checked', () => {
        const { container } = render(<Checkbox checked={true} onChange={mockOnChange} />);
        const checkbox = container.querySelector('input[type="checkbox"]');
        
        if (checkbox) {
            fireEvent.click(checkbox);
            expect(mockOnChange).toHaveBeenCalledWith(false);
        }
    });

    it('shows arrow icon when checked', () => {
        render(<Checkbox checked={true} onChange={mockOnChange} />);
        const arrow = screen.getByAltText('Arrow');
        expect(arrow).toBeInTheDocument();
    });

    it('does not show arrow icon when unchecked', () => {
        render(<Checkbox checked={false} onChange={mockOnChange} />);
        const arrow = screen.queryByAltText('Arrow');
        expect(arrow).not.toBeInTheDocument();
    });

    it('applies voting styles when voting prop is true', () => {
        const { container } = render(<Checkbox checked={false} onChange={mockOnChange} voting={true} />);
        const checkboxContainer = container.querySelector('div');
        expect(checkboxContainer?.className).toContain('outline-[2px]');
    });

    it('does not apply voting styles when voting prop is false', () => {
        const { container } = render(<Checkbox checked={false} onChange={mockOnChange} voting={false} />);
        const checkboxContainer = container.querySelector('div');
        expect(checkboxContainer?.className).not.toContain('outline-[2px]');
    });
}); 