import { render, screen, fireEvent } from '@testing-library/react';
import { Select, Option } from './select';

// Мокаем SVG импорт
jest.mock('../../assets/arrowSelect.svg', () => 'svg-mock');

describe('Select Component', () => {
    const mockOptions: Option[] = [
        { label: 'Option 1', value: true },
        { label: 'Option 2', value: false },
        { label: 'Option 3', value: 1, repeat: true }
    ];

    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with placeholder when no value selected', () => {
        render(<Select options={mockOptions} placeholder="Select option" onChange={mockOnChange} />);
        expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('shows options list when clicked', () => {
        render(<Select options={mockOptions} placeholder="Select option" onChange={mockOnChange} />);
        
        const button = screen.getByText('Select option');
        fireEvent.click(button);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('selects option when clicked', () => {
        render(<Select options={mockOptions} placeholder="Select option" onChange={mockOnChange} />);
        
        // Открываем список
        fireEvent.click(screen.getByText('Select option'));
        
        // Выбираем опцию
        fireEvent.click(screen.getByText('Option 1'));
        
        // Проверяем, что опция выбрана
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(mockOnChange).toHaveBeenCalledWith(true, undefined);
    });

    it('closes dropdown after selection', () => {
        render(<Select options={mockOptions} placeholder="Select option" onChange={mockOnChange} />);
        
        // Открываем список
        fireEvent.click(screen.getByText('Select option'));
        
        // Выбираем опцию
        fireEvent.click(screen.getByText('Option 1'));
        
        // Проверяем, что список закрылся
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('displays selected value from props', () => {
        render(
            <Select 
                options={mockOptions} 
                placeholder="Select option" 
                onChange={mockOnChange} 
                value={false}
            />
        );
        
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('passes repeat flag in onChange when option has it', () => {
        render(<Select options={mockOptions} placeholder="Select option" onChange={mockOnChange} />);
        
        // Открываем список
        fireEvent.click(screen.getByText('Select option'));
        
        // Выбираем опцию с repeat
        fireEvent.click(screen.getByText('Option 3'));
        
        expect(mockOnChange).toHaveBeenCalledWith(1, true);
    });
}); 