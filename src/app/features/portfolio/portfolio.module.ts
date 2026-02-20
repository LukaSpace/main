import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioComponent } from './portfolio.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, PortfolioRoutingModule, RouterLink, RouterModule],
  declarations: [PortfolioComponent],
})
export class PortfolioModule {}
