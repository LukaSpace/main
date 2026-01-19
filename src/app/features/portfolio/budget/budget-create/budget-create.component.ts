import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Cost, CostType, CostTypeDisplay, Income, IncomeType, IncomeTypeDisplay, MonthSummary } from '../../../../interfaces/portfolio/budget/model';

@Component({
  selector: 'budget-create',
  templateUrl: './budget-create.component.html',
  styleUrl: './budget-create.component.scss'
})
export class BudgetCreateComponent {

  costType = CostType;
  costTypeDisplay = CostTypeDisplay;
  incomeType = IncomeType;
  incomeTypeDisplay = IncomeTypeDisplay;
  form: FormGroup = this.fb.group({
    year: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
    month: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    incomes:  this.fb.array([
      this.fb.group({
        value: ['', Validators.required],
        type: [IncomeType.None, Validators.required],
        date: [new Date(), Validators.required],
      })
    ]),
    costs: this.fb.array([
      this.fb.group({
        value: ['', Validators.required],
        type: [CostType.None, Validators.required],
        date: [new Date(), Validators.required],
      })
    ]),
  });
  costTypes: CostType[] = Object.values(CostType).filter(f => !isNaN(Number(f))).map(v => v as CostType);
  incomeTypes: IncomeType[] = Object.values(IncomeType).filter(f => !isNaN(Number(f))).map(v => v as IncomeType);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BudgetCreateComponent>
  ) {
  }

  get costs() {
    return this.form.controls["costs"] as FormArray;
  }

  get incomes() {
    return this.form.controls["incomes"] as FormArray;
  }

  addCost() {
    const costForm = this.fb.group({
      value: ['', Validators.required],
      type: [[...this.costs.value].reverse()[0].type, Validators.required],
      date: [[...this.costs.value].reverse()[0].date, Validators.required],
    });
    this.costs.push(costForm);
  }

  addIncome() {
    const incomeForm = this.fb.group({
      value: ['', Validators.required],
      type: [[...this.incomes.value].reverse()[0].type, Validators.required],
      date: [[...this.incomes.value].reverse()[0].date, Validators.required],
    });
    this.incomes.push(incomeForm);
  }

  deleteCost(costId: number) {
    this.costs.removeAt(costId);
  }

  deleteIncome(incomeId: number) {
    this.incomes.removeAt(incomeId);
  }

  getTabIndex(index: number, factor: number, elementId: number){
    return (index * 111 * factor) + elementId;
  }

  submit() {
    if(this.form.valid){
      let incomesToSend: Income[] = this.incomes.controls.map((income) => {
        let incomeControl = income.value;
        return {
          value: incomeControl.value,
          incomeType: incomeControl.type,
          date: incomeControl.date,
        }
      })
      let costsToSend: Cost[] = this.costs.controls.map((cost) => {
        let costControl = cost.value;
        return {
          value: costControl.value,
          costType: costControl.type,
          date: costControl.date,
        }
      })

      let monthSummary: MonthSummary = {
        year: this.form.value.year,
        month: this.form.value.month,
        incomes: incomesToSend,
        costs: costsToSend,
      }
      this.dialogRef.close(monthSummary);
    }
  }

  getCostType(costName: string): CostType {
    return Object.values(CostType)[Object.keys(CostType).indexOf(costName)] as CostType;
  }
}
