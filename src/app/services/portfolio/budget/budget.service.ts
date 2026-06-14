import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cost, CostType, IncomeType, MonthSummary } from '../../../interfaces/portfolio/budget/model';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  constructor(private http: HttpClient) {}

  addCosts(costs: Cost[]) {
    return this.http.post<Cost[]>('http://localhost:5264/Cost/AddCosts', costs);
  }

  deleteCost(costId: number) {
    return this.http.post<Cost[]>('http://localhost:5264/Cost/DeleteCostByID', costId);
  }

  getAllMonthSummaries() {
    return this.http.get<MonthSummary[]>('http://localhost:5264/MonthSummary/GetAllMonthSummaries').pipe(catchError(() => of(this.generateMockMonthSummaries())));
  }

  getMonthSummariesByDate(startDate: Date, endDate: Date) {
    return this.http.get<MonthSummary[]>(`http://localhost:5264/MonthSummary/GetMonthSummariesByDate?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`).pipe(
      catchError(() =>
        of(
          this.generateMockMonthSummaries()
            .filter(s => {
              const summaryIndex = s.year * 12 + s.month;
              const startIndex = startDate.getFullYear() * 12 + startDate.getMonth();
              const endIndex = endDate.getFullYear() * 12 + endDate.getMonth();
              return summaryIndex >= startIndex && summaryIndex <= endIndex;
            })
            .sort((a, b) => a.year - b.year || a.month - b.month)
        )
      )
    );
  }

  addMonthSummary(monthSummary: MonthSummary) {
    return this.http.post<MonthSummary[]>('http://localhost:5264/MonthSummary/AddMonthSummary', monthSummary);
  }

  deleteMonthSummary(summaryId: number) {
    return this.http.post<MonthSummary[]>('http://localhost:5264/MonthSummary/DeleteMonthSummaryByID', summaryId);
  }

  private generateMockMonthSummaries(): MonthSummary[] {
    const summaries: MonthSummary[] = [];
    const incomeTypes = [IncomeType.Sales, IncomeType.Services, IncomeType.Taxes, IncomeType.Investment, IncomeType.Grants, IncomeType.Other];
    for (let y = 2024; y <= 2026; y++) {
      const startDate = new Date(y, 0, 1);
      for (let m = 0; m < 12; m++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + m);
        const incomeType1 = incomeTypes[Math.floor(Math.random() * incomeTypes.length)];
        const incomeType2 = incomeTypes[Math.floor(Math.random() * incomeTypes.length)];
        const incomeType3 = incomeTypes[Math.floor(Math.random() * incomeTypes.length)];

        const incomeValueForType = (type: IncomeType) => {
          switch (type) {
            case IncomeType.Sales:
              return Math.floor(Math.random() * 80000) + 20000; // 20k - 100k
            case IncomeType.Services:
              return Math.floor(Math.random() * 40000) + 5000; // 5k - 45k
            case IncomeType.Taxes:
              return Math.floor(Math.random() * 4000) + 2000; // 2000 - 6000
            case IncomeType.Investment:
              return Math.floor(Math.random() * 15000) + 500; // 500 - 15500
            case IncomeType.Grants:
              return Math.floor(Math.random() * 10000) + 1000; // 1k - 11k
            default:
              return Math.floor(Math.random() * 5000) + 500; // 500 - 5500
          }
        };

        const summary: MonthSummary = {
          month: date.getMonth(),
          year: date.getFullYear(),
          incomes: [
            {
              value: incomeValueForType(incomeType1),
              date: new Date(date),
              incomeType: incomeType1,
            },
            {
              value: incomeValueForType(incomeType2),
              date: new Date(date),
              incomeType: incomeType2,
            },
            {
              value: incomeValueForType(incomeType3),
              date: new Date(date),
              incomeType: incomeType3,
            },
          ],
          costs: this.generateMockCosts(date),
        };
        summaries.push(summary);
      }
    }

    return summaries;
  }

  private generateMockCosts(startDate?: Date): Cost[] {
    const costs: Cost[] = [];
    const costTypes = [CostType.Operating, CostType.Rent, CostType.Salaries, CostType.Marketing, CostType.Utilities, CostType.Taxes, CostType.Other];
    const startDateToUse = startDate ? startDate : new Date(2026, 0, 1);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDateToUse);
      date.setDate(date.getDate() + Math.floor(Math.random() * 28));

      const chosenCostType = costTypes[Math.floor(Math.random() * costTypes.length)];
      let value = 0;
      switch (chosenCostType) {
        case CostType.Salaries:
          value = Math.floor(Math.random() * 45000) + 5000; // 5k - 50k
          break;
        case CostType.Rent:
          value = Math.floor(Math.random() * 9000) + 1000; // 1k - 10k
          break;
        case CostType.Marketing:
          value = Math.floor(Math.random() * 15000) + 500; // 500 - 15.5k
          break;
        case CostType.Operating:
          value = Math.floor(Math.random() * 10000) + 500; // 500 - 10.5k
          break;
        case CostType.Utilities:
          value = Math.floor(Math.random() * 3000) + 200; // 200 - 3.2k
          break;
        case CostType.Taxes:
          value = Math.floor(Math.random() * 20000) + 1000; // 1k - 21k
          break;
        default:
          value = Math.floor(Math.random() * 5000) + 100; // 100 - 5.1k
          break;
      }

      costs.push({
        value,
        date: date,
        costType: chosenCostType,
      });
    }

    return costs;
  }
}
