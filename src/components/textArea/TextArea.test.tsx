import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from './textArea';

describe('TextArea Component', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        label: 'Test Label',
        value: '',
        onChange: mockOnChange,
        placeholder: 'Test Placeholder'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with label', () => {
        render(<TextArea {...defaultProps} />);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
        render(<TextArea {...defaultProps} />);
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('renders with initial value', () => {
        render(<TextArea {...defaultProps} value="Initial Value" />);
        expect(screen.getByDisplayValue('Initial Value')).toBeInTheDocument();
    });

    it('calls onChange handler when text changes', () => {
        render(<TextArea {...defaultProps} />);
        const textarea = screen.getByRole('textbox');
        
        fireEvent.change(textarea, { target: { value: 'New Value' } });
        
        expect(mockOnChange).toHaveBeenCalledWith('New Value');
    });

    it('updates internal state when value changes', () => {
        render(<TextArea {...defaultProps} />);
        const textarea = screen.getByRole('textbox');
        
        fireEvent.change(textarea, { target: { value: 'New Value' } });
        
        expect(textarea).toHaveValue('New Value');
    });

    it('applies correct CSS classes', () => {
        render(<TextArea {...defaultProps} />);
        const textarea = screen.getByRole('textbox');
        
        expect(textarea.className).toContain('w-[755px]');
        expect(textarea.className).toContain('h-[77px]');
        expect(textarea.className).toContain('resize-none');
    });

    it('maintains value after multiple changes', () => {
        render(<TextArea {...defaultProps} />);
        const textarea = screen.getByRole('textbox');
        
        fireEvent.change(textarea, { target: { value: 'First Change' } });
        expect(textarea).toHaveValue('First Change');
        
        fireEvent.change(textarea, { target: { value: 'Second Change' } });
        expect(textarea).toHaveValue('Second Change');
    });
}); 