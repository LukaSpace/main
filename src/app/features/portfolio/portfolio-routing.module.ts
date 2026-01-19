import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';

const routes: Routes = [
    {
      path: '',
      component: PortfolioComponent,
    },
    {
      path: 'budget',
      loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule { }

