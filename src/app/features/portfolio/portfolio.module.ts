import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioComponent } from './portfolio.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PortfolioRoutingModule } from './portfolio-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    PortfolioRoutingModule,
    ],
  declarations: [
    PortfolioComponent,
  ]
})
export class PortfolioModule {}