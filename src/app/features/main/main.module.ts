import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDivider } from "@angular/material/divider";
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
        { path: '', component: MainComponent, },
    ]),
    MatButton,
    MatCardModule,
    MatGridListModule,
    MatDivider,
    MatIconModule,
    MatIconButton,
],
  declarations: [
    MainComponent
  ]
})
export class MainModule {}