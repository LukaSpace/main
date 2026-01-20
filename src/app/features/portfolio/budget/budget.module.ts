import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetComponent } from './budget.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetCreateComponent } from './budget-create/budget-create.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { GetCostByTypePipe } from '../../../core/pipes/get-cost-by-type.pipe';
import { GetIncomeByTypePipe } from '../../../core/pipes/get-income-by-type.pipe';

PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  imports: [
    CommonModule,
    BudgetRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatListModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    PlotlyModule
  ],
  declarations: [
    BudgetComponent,
    BudgetOverviewComponent,
    BudgetListComponent,
    BudgetCreateComponent,
    GetCostByTypePipe,
    GetIncomeByTypePipe
  ],
  providers: [
    MatDatepickerModule,
    GetCostByTypePipe,
    GetIncomeByTypePipe
  ]
})
export class BudgetModule {}