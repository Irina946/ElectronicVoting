import ExcelJS from 'exceljs';
import { IQuestionWithVote } from '../pages/results/results';

export const generateExcelFile = async (data: IQuestionWithVote[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Результаты голосования');

    // Установка ширины столбцов
    worksheet.columns = [
        { width: 65 }, // A
        { width: 15 }, // B - ЗА
        { width: 15 }, // C - ПРОТИВ
        { width: 15 }, // D - ВОЗДЕРЖАЛСЯ
    ];

    let rowIndex = 1;

    for (const question of data) {
        // Добавляем вопрос
        const questionRow = worksheet.getRow(rowIndex);
        questionRow.getCell(1).value = `Вопрос: ${question.question}`;
        questionRow.getCell(2).value = 'ЗА';
        questionRow.getCell(3).value = 'ПРОТИВ';
        questionRow.getCell(4).value = 'ВОЗДЕРЖАЛСЯ';
        questionRow.font = { bold: true };
        rowIndex++;

        // Добавляем решение
        const decisionRow = worksheet.getRow(rowIndex);
        decisionRow.getCell(1).value = `Решение: ${question.decision}`;
        const vote = question.vote?.[0];
        if (vote) {
            decisionRow.getCell(2).value = vote.For?.Quantity || 0;
            decisionRow.getCell(3).value = vote.Against?.Quantity || 0;
            decisionRow.getCell(4).value = vote.Abstain?.Quantity || 0;
        }
        rowIndex++;

        // Пустая строка после решения
        rowIndex++;

        if (question.details.length > 0) {
            // Добавляем заголовок "ФИО кандидата"
            const candidateHeaderRow = worksheet.getRow(rowIndex);
            candidateHeaderRow.getCell(1).value = 'ФИО кандидата';
            candidateHeaderRow.getCell(2).value = 'ЗА';
            candidateHeaderRow.getCell(3).value = 'ПРОТИВ';
            candidateHeaderRow.getCell(4).value = 'ВОЗДЕРЖАЛСЯ';
            candidateHeaderRow.font = { bold: true };
            rowIndex++;

            // Добавляем кандидатов
            question.details.forEach((detail, index) => {
                const candidateRow = worksheet.getRow(rowIndex);
                candidateRow.getCell(1).value = detail.detail_text;
                const vote = question.vote?.[index];
                if (vote) {
                    candidateRow.getCell(2).value = vote.For?.Quantity || 0;
                    candidateRow.getCell(3).value = vote.Against?.Quantity || 0;
                    candidateRow.getCell(4).value = vote.Abstain?.Quantity || '';
                }
                rowIndex++;
            });
        }

        // Пустая строка между вопросами
        rowIndex++;
    }

    // Применяем стили к ячейкам
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Выравнивание по левому краю для первой колонки
        const firstCell = row.getCell(1);
        firstCell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    // Генерируем файл
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'результаты_голосования.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
}; 