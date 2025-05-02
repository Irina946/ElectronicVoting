import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './header';

// Мокаем SVG импорты
jest.mock('../../assets/header1.svg', () => 'header1-mock');
jest.mock('../../assets/header2.svg', () => 'header2-mock');

describe('Header Component', () => {
    const renderWithRouter = (component: React.ReactNode, { route = '/' } = {}) => {
        window.history.pushState({}, '', route);
        return render(
            <BrowserRouter>
                {component}
            </BrowserRouter>
        );
    };

    it('renders header images', () => {
        renderWithRouter(<Header />);
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', 'header2-mock');
        expect(images[1]).toHaveAttribute('src', 'header2-mock');
    });

    it('renders navigation breadcrumbs for admin meeting page', () => {
        renderWithRouter(<Header />, { route: '/admin/meeting/123' });
        expect(screen.getByText('Главная')).toBeInTheDocument();
        expect(screen.getByText('Услуги')).toBeInTheDocument();
        expect(screen.getByText(/Сервис - Личный кабинет/)).toBeInTheDocument();
        expect(screen.getByText('Сервис - Общее собрание акционеров')).toBeInTheDocument();
        expect(screen.getByText(/Собрание/)).toBeInTheDocument();
    });

    it('renders navigation breadcrumbs for user voting page', () => {
        renderWithRouter(<Header />, { route: '/user/meeting/123/voting/456' });
        expect(screen.getByText('Главная')).toBeInTheDocument();
        expect(screen.getByText('Услуги')).toBeInTheDocument();
        expect(screen.getByText(/Сервис - Личный кабинет/)).toBeInTheDocument();
        expect(screen.getByText('Сервис - Общее собрание акционеров')).toBeInTheDocument();
        expect(screen.getByText(/Голосование/)).toBeInTheDocument();
    });

    it('renders navigation breadcrumbs for user result page with return link', () => {
        renderWithRouter(<Header />, { route: '/user/meeting/123/result/456' });
        expect(screen.getByText('Главная')).toBeInTheDocument();
        expect(screen.getByText('Услуги')).toBeInTheDocument();
        expect(screen.getByText(/Сервис - Личный кабинет/)).toBeInTheDocument();
        expect(screen.getByText('Сервис - Общее собрание акционеров')).toBeInTheDocument();
        expect(screen.getByText(/Результаты голосования/)).toBeInTheDocument();
        expect(screen.getByText('Вернуться к голосованию')).toBeInTheDocument();
    });

    it('applies correct styles', () => {
        const { container } = renderWithRouter(<Header />);
        const header = container.firstChild as HTMLElement;
        expect(header).toHaveClass('flex');
        expect(header).toHaveClass('flex-col');
        expect(header).toHaveClass('justify-center');
        expect(header).toHaveClass('items-center');
    });
}); 