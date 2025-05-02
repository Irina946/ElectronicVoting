import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input';

describe('Input Component', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders input with correct placeholder', () => {
        render(<Input placeholder="Test Placeholder" value="" onChange={mockOnChange} />);
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('displays initial value correctly', () => {
        render(<Input placeholder="Test" value="Initial Value" onChange={mockOnChange} />);
        expect(screen.getByDisplayValue('Initial Value')).toBeInTheDocument();
    });

    it('calls onChange handler when value changes', () => {
        render(<Input placeholder="Test" value="" onChange={mockOnChange} />);
        const input = screen.getByPlaceholderText('Test');
        fireEvent.change(input, { target: { value: 'New Value' } });
        expect(mockOnChange).toHaveBeenCalledWith('New Value');
    });

    it('updates value when props change', () => {
        const { rerender } = render(<Input placeholder="Test" value="Initial" onChange={mockOnChange} />);
        expect(screen.getByDisplayValue('Initial')).toBeInTheDocument();
        
        rerender(<Input placeholder="Test" value="Updated" onChange={mockOnChange} />);
        expect(screen.getByDisplayValue('Updated')).toBeInTheDocument();
    });

    it('has correct CSS classes', () => {
        render(<Input placeholder="Test" value="" onChange={mockOnChange} />);
        const input = screen.getByPlaceholderText('Test');
        expect(input).toHaveClass('w-[100%]');
        expect(input).toHaveClass('h-7');
        expect(input).toHaveClass('py-[5px]');
        expect(input).toHaveClass('px-[10px]');
    });
}); 