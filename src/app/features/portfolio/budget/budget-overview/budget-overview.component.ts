import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../../../services/portfolio/budget/budget.service';
import { Cost, CostType, CostTypeDisplay, Income, MonthSummary } from '../../../../interfaces/portfolio/budget/model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss',
})
export class BudgetOverviewComponent implements OnInit {
  public costGraph: any;
  public incomesVsCostsGraph: any;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private costTypeDisplay = CostTypeDisplay;

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
        let costs: Cost[] = [];
        monthSumaries.forEach(monthSummary => monthSummary.costs.forEach(cost => costs.push(cost)));
        this.updateIncomesVsCostsGraphData(monthSumaries);
        this.updateCostGraphData(costs)
    });
    }
  }

  loadData() {
    this.showIncomesVsCosts();
    this.showAllCosts();
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
        legend: { font: { color: '#fff' } } // white legend text
      }
    };
  }

  showAllCosts()
  {
    this.budgetService.getAllMonthSummaries().subscribe((monthSumaries) => 
      {
        let costs: Cost[] = [];
        monthSumaries.forEach(monthSummary => monthSummary.costs.forEach(cost => costs.push(cost)))
        this.updateCostGraphData(costs);
        if(costs.length < 1)
          return;

        this.range.controls.start.setValue(costs[0].date);
        this.range.controls.end.setValue(costs[costs.length - 1].date);
      });
  }

  updateCostGraphData (costs: Cost[])
  {
    if(!costs || costs.length < 1)
    {
      this.costGraph = null;
      return;
    }

    let countPerType: {[k: number]: number} = Object.fromEntries(Object.keys(CostType).filter((item) => !isNaN(Number(item))).map(k => [Number(k), 0]));
    costs.forEach((cost: Cost) => {
        countPerType[cost.costType] += cost.value
    });
    this.costGraph = {
      data: [
          {
            values: Object.values(countPerType),
            labels: Object.keys(countPerType).map(k => this.costTypeDisplay[Number(k)] ),
            type: 'pie',
            textinfo: "label+percent",
            hoverinfo: 'label+value+percent',
            hole: .4,
            textposition: "outside",
            automargin: true,
            showlegend: false,
          },
      ],
      layout: {
        title: 'Costs Overview',
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#fff' },
        annotations: [
          {
            font: {
              size: 14
            },
            showarrow: false,
            text: costs.map(c => c.value).reduce((a, b) => a + b),
            x: 0.5,
            y: 0.5
          },
        ],
      }
    };
  }

}