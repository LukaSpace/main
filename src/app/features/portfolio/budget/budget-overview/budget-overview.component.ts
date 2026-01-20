import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../../../services/portfolio/budget/budget.service';
import { Cost, CostType, CostTypeDisplay } from '../../../../interfaces/portfolio/budget/model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss',
})
export class BudgetOverviewComponent implements OnInit {
  public graph: any;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private costTypeDisplay = CostTypeDisplay;

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit() {
    this.showAllCosts();
  }

  onDataChange()
  {
    let start = this.range.controls.start.value;
    let end = this.range.controls.end.value;

    if(start && end)
      this.budgetService.getCostsByDate(this.range.controls.start.value!, this.range.controls.end.value!).subscribe((costs) => this.updateGraphData(costs));
  }

  showAllCosts()
  {
    this.budgetService.getAllCosts().subscribe((costs) => 
      {
        this.updateGraphData(costs);
        if(costs.length < 1)
          return;

        this.range.controls.start.setValue(costs[0].date);
        this.range.controls.end.setValue(costs[costs.length - 1].date);
      });
  }

  updateGraphData (costs: Cost[])
  {
    if(!costs || costs.length < 1)
    {
      this.graph = null;
      return;
    }

    let countPerType: {[k: number]: number} = Object.fromEntries(Object.keys(CostType).filter((item) => !isNaN(Number(item))).map(k => [Number(k), 0]));
    costs.forEach((cost: Cost) => {
        countPerType[cost.costType] += cost.value
    });
    this.graph = {
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