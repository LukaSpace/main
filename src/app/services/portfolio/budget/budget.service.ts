import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cost, CostType, IncomeType, MonthSummary } from '../../../interfaces/portfolio/budget/model';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  constructor(private http: HttpClient) { }

  addCosts(costs: Cost[]) {
    return this.http.post<Cost[]>('http://localhost:5264/Cost/AddCosts', costs);
  }

  deleteCost(costId: number) {
    return this.http.post<Cost[]>('http://localhost:5264/Cost/DeleteCostByID', costId);
  }

  getAllMonthSummaries() {
    return this.http.get<MonthSummary[]>('http://localhost:5264/MonthSummary/GetAllMonthSummaries').pipe(
      catchError(() => of(this.generateMockMonthSummaries()))
    );
  }

  getMonthSummariesByDate(startDate: Date, endDate: Date) {
     return this.http.get<MonthSummary[]>(
      `http://localhost:5264/MonthSummary/GetMonthSummariesByDate?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    ).pipe(
      catchError(() => of(
        this.generateMockMonthSummaries()
          .filter(s => {
            const summaryIndex = s.year * 12 + s.month;
            const startIndex = startDate.getFullYear() * 12 + startDate.getMonth();
            const endIndex = endDate.getFullYear() * 12 + endDate.getMonth();
            return summaryIndex >= startIndex && summaryIndex <= endIndex;
          })
          .sort((a, b) => (a.year - b.year) || (a.month - b.month))
      ))
    );
  }

  addMonthSummary(monthSummary: MonthSummary) {
    return this.http.post<MonthSummary[]>('http://localhost:5264/MonthSummary/AddMonthSummary', monthSummary);
  }

  deleteMonthSummary(summaryId: number) {
    return this.http.post<MonthSummary[]>('http://localhost:5264/MonthSummary/DeleteMonthSummaryByID', summaryId);
  }

  private generateMockCosts(startDate?: Date): Cost[] {
    const costs: Cost[] = [];
    const costTypes = [CostType.Cars, CostType.Credit, CostType.Food, CostType.Fun, CostType.General, CostType.House];
    const startDateToUse = startDate ? startDate : new Date(2026, 0, 1);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDateToUse);
      date.setDate(date.getDate() + Math.floor(Math.random() * 20));
      
      costs.push({
      value: Math.floor(Math.random() * 500) + 10,
      date: date,
      costType: costTypes[Math.floor(Math.random() * costTypes.length)]
      });
    }

    return costs;
  }

  private generateMockMonthSummaries(): MonthSummary[] {
    const summaries: MonthSummary[] = [];
    const incomeTypes = [IncomeType.Salary, IncomeType.WifeSalary, IncomeType.Sale, IncomeType.Other];
    for (let y = 2024; y <= 2026; y++) {
      const startDate = new Date(y, 0, 1);
      for (let m = 0; m < 12; m++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + m);
        let summary: MonthSummary = {
          month: date.getMonth(),
          year: date.getFullYear(),
          incomes:
          [
            { value: Math.floor(Math.random() * 5000) + 2000,
              date: new Date(date),
              incomeType: incomeTypes[Math.floor(Math.random() * incomeTypes.length)]
            },
            { value: Math.floor(Math.random() * 2000) + 2000,
              date: new Date(date),
              incomeType: incomeTypes[Math.floor(Math.random() * incomeTypes.length)]
            },
            { value: Math.floor(Math.random() * 2000) + 2000,
              date: new Date(date),
              incomeType: incomeTypes[Math.floor(Math.random() * incomeTypes.length)]
            },
          ],
          costs: this.generateMockCosts(date),
        }
        summaries.push(summary);
      }
    }
    
    return summaries;
  }
}