import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate(250, style({ transform: 'translateY(0)' }))
      ]),
    ]),
  ],
})
export class ContactComponent {

}
