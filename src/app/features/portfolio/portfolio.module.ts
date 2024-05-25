import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';
import { BudgetComponent } from './budget/budget.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild([
        { path: '', component: PortfolioComponent, },
        { path: 'budget', component: BudgetComponent, },
      ])
    ],
  declarations: [
    PortfolioComponent,
    BudgetComponent
  ]
})
export class PortfolioModule {}