import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';

const routes: Routes = [
    {
      path: '',
      component: BudgetComponent,
      children: [
        {
            path: 'list',
            component: BudgetListComponent
        },
        {
          path: 'overview',
          component: BudgetOverviewComponent
        }
      ]
    },
    
    { path: '**', redirectTo: '/overview' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }

