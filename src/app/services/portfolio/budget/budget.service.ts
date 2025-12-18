import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cost, MonthSummary } from '../../../interfaces/portfolio/budget/model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  constructor(private http: HttpClient) { }

  getAllCosts() {
    return this.http.get<Cost[]>('http://localhost:5264/Cost/GetAllCosts');
  }

  getCostsByDate(startDate: Date, endDate: Date) {
    return this.http.get<Cost[]>(`http://localhost:5264/Cost/GetCostsByDate?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
  }

  addCosts(costs: Cost[]) {
    return this.http.post<Cost[]>('http://localhost:5264/Cost/AddCosts', costs);
  }

  deleteCost(costId: number) {
    return this.http.post<Cost[]>('http://localhost:5264/Cost/DeleteCostByID', costId);
  }

  getAllMonthSummaries() {
    return this.http.get<MonthSummary[]>('http://localhost:5264/MonthSummary/GetAllMonthSummaries');
  }

  addMonthSummary(monthSummary: MonthSummary) {
    return this.http.post<MonthSummary[]>('http://localhost:5264/MonthSummary/AddMonthSummary', monthSummary);
  }

  deleteMonthSummary(summaryId: number) {
    return this.http.post<MonthSummary[]>('http://localhost:5264/MonthSummary/DeleteMonthSummaryByID', summaryId);
  }
}