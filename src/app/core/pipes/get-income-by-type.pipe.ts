import { Pipe, PipeTransform } from '@angular/core';
import { Income, IncomeType } from '../../interfaces/portfolio/budget/model';

@Pipe({ name: 'getIncomeByType' })
export class GetIncomeByTypePipe implements PipeTransform {
    transform(incomes: Income[], incomeType: IncomeType): number {
        if (!incomes || !Array.isArray(incomes)) {
            return 0;
        }
        return incomes
            .filter(income => income.incomeType === incomeType)
            .reduce((sum, income) => sum + income.value, 0);
    }
}