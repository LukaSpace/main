import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate(250, style({ transform: 'translateY(0)' }))
      ]),
    ]),
  ],
})
export class MainComponent {}