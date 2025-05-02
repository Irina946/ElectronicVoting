import { render, screen } from '@testing-library/react'
import { TableHeader } from './tableHeader'

describe('TableHeader', () => {
    it('отображает заголовок таблицы', () => {
        render(<TableHeader />)
        
        expect(screen.getByText('№')).toBeInTheDocument()
        expect(screen.getByText('Вопрос / Решение')).toBeInTheDocument()
        expect(screen.getByText('ЗА')).toBeInTheDocument()
        expect(screen.getByText('ПРОТИВ')).toBeInTheDocument()
        expect(screen.getByText('ВОЗДЕРЖАЛСЯ')).toBeInTheDocument()
    })

    it('отображает все заголовки с жирным шрифтом', () => {
        render(<TableHeader />)
        
        const headers = screen.getAllByText(/^(№|Вопрос \/ Решение|ЗА|ПРОТИВ|ВОЗДЕРЖАЛСЯ)$/)
        headers.forEach(header => {
            expect(header).toHaveClass('font-bold')
        })
    })

    it('отображает правильное количество колонок', () => {
        render(<TableHeader />)
        const grid = screen.getByText('№').parentElement
        expect(grid?.className).toContain('grid')
        expect(grid?.className).toContain('grid-cols-[36px_532px_133px_133px_126px]')
    })
}) 