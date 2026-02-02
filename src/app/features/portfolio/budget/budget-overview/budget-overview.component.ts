import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../../../services/portfolio/budget/budget.service';
import { Cost, Income, MonthSummary } from '../../../../interfaces/portfolio/budget/model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss',
})
export class BudgetOverviewComponent implements OnInit {
  public incomesVsCostsGraph: any;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit() {
    this.loadData();
  }

  onDataChange()
  {
    let start = this.range.controls.start.value;
    let end = this.range.controls.end.value;

    if(start && end) {
      this.budgetService.getMonthSummariesByDate(start, end).subscribe((monthSumaries) => {
        this.updateIncomesVsCostsGraphData(monthSumaries);
    });
    }
  }

  loadData() {
    this.showIncomesVsCosts();
  }

  showIncomesVsCosts() {
    this.budgetService.getAllMonthSummaries().subscribe((monthSumaries) => {
      this.updateIncomesVsCostsGraphData(monthSumaries);
    })
  }

  updateIncomesVsCostsGraphData (monthSumaries: MonthSummary[]) {
    if(!monthSumaries || monthSumaries.length < 1)
    {
      this.incomesVsCostsGraph = null;
      return;
    }

    const months = monthSumaries.map(m => `${m.month + 1}/${m.year}`);
    const incomes = monthSumaries.map(m => m.incomes.map((income: Income) => income.value).reduce((a: number, b: number) => a + b, 0));
    const costs = monthSumaries.map(m => m.costs.map((cost: Cost) => cost.value).reduce((a: number, b: number) => a + b, 0));

    this.incomesVsCostsGraph = {
      data: [
        {
          x: months,
          y: incomes,
          name: 'Income',
          type: 'scatter',
          mode: 'lines',
          line: { color: 'green' }
        },
        {
          x: months,
          y: costs,
          name: 'Costs',
          type: 'scatter',
          mode: 'lines',
          line: { color: 'red' }
        }
      ],
      layout: {
        title: { text: 'Incomes vs Costs', font: { color: '#fff' } },
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#fff' },
        xaxis: { title: 'Month/Year', tickfont: { color: '#fff' }, gridcolor: 'rgba(255,255,255,0.2)' },
        yaxis: { title: 'Amount', tickfont: { color: '#fff' }, gridcolor: 'rgba(255,255,255,0.2)' },
        hovermode: 'x unified',
        hoverlabel: { font: { color: '#000' } },
        legend: { font: { color: '#fff' }, orientation: 'h', y: 1.1}
      }
    };
  }
}