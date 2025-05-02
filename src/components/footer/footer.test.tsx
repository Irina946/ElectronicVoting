import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

// Мокаем SVG импорт
jest.mock('../../assets/footer.svg', () => 'footer-mock');

describe('Footer Component', () => {
    it('renders footer image', () => {
        render(<Footer />);
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'footer-mock');
        expect(image).toHaveAttribute('alt', 'Footer');
    });

    it('applies correct styles', () => {
        const { container } = render(<Footer />);
        const footer = container.firstChild as HTMLElement;
        expect(footer).toHaveClass('flex');
        expect(footer).toHaveClass('flex-col');
        expect(footer).toHaveClass('justify-center');
        expect(footer).toHaveClass('items-center');
        expect(footer).toHaveClass('w-[100%]');
        expect(footer).toHaveClass('bg-(--color-footer)');
    });
}); 