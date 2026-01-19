import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BudgetService } from '../../../../services/portfolio/budget/budget.service';
import { BudgetValue, Cost, CostType, CostTypeDisplay, Income, IncomeTypeDisplay, MonthSummary } from '../../../../interfaces/portfolio/budget/model';
import { MatDialog } from '@angular/material/dialog';
import { BudgetCreateComponent } from '../budget-create/budget-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'budget-list',
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
  animations: [
  trigger('detailExpand', [
    state('collapsed', style({height: '0px', minHeight: '0'})),
    state('expanded', style({height: '*'})),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
],
})
export class BudgetListComponent implements AfterViewInit {
  dataSource: MatTableDataSource<MonthSummary> = new MatTableDataSource();
  costDataSource: MatTableDataSource<Cost> = new MatTableDataSource();
  incomeDataSource: MatTableDataSource<Income> = new MatTableDataSource()
  costTypeDisplay = CostTypeDisplay;
  incomeTypeDisplay = IncomeTypeDisplay;
  displayedColumns: string[] = ['year', 'month', 'income', 'outcome', 'actions'];
  expandedElement: MonthSummary | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private budgetService: BudgetService, private dialog: MatDialog) {
    this.budgetService.getAllMonthSummaries().subscribe((monthSummaries) => this.updateTableDataSet(monthSummaries));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addNewMonthSummary() {
    const dialogRef = this.dialog.open(BudgetCreateComponent);

    dialogRef.afterClosed().subscribe((data) => {
      if(data) {
        this.budgetService.addMonthSummary(data).subscribe((monthSummaries) => this.updateTableDataSet(monthSummaries));
      }
    });
  }

  deleteMonthSummary(monthSummaryId: number) {
    this.budgetService.deleteMonthSummary(monthSummaryId).subscribe((monthSummaries) => this.updateTableDataSet(monthSummaries));
  }
  
  getSumOf(bugets: BudgetValue[]) {
    return bugets.map(x => x.value).reduce((acc, curr) => acc + curr, 0);
  }

  adjustExpandedElement(element: MonthSummary) {
    this.expandedElement = this.expandedElement === element ? null : element;

    if(this.expandedElement) {
      this.costDataSource.data = this.expandedElement.costs;
      this.incomeDataSource.data = this.expandedElement.incomes;
    }
  }

  private updateTableDataSet(costs: MonthSummary[]) {
    this.dataSource.data = costs;
  }

}