import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate(250, style({ transform: 'translateY(0)' }))
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule]
})
export class TechnologiesComponent {
    technologies = [
  {
    name: 'C#',
    icon: 'code',
    description: 'Business logic.'
  },
  {
    name: 'Angular',
    icon: 'web',
    description: 'Frontend applications.'
  },
  {
    name: 'Azure Boards',
    icon: 'dashboard',
    description: 'Work planning and task management.'
  },
  {
    name: 'Azure Pipelines',
    icon: 'autorenew',
    description: 'Implementing CI/CD pipelines.'
  },
  {
    name: 'Microsoft SQL',
    icon: 'storage',
    description: 'Database design and data management.'
  },
  {
    name: 'Tailwind',
    icon: 'palette',
    description: 'Utility-first CSS for fast UI development.'
  },
  {
    name: 'xUnit / NUnit',
    icon: 'fact_check',
    description: 'Frameworks for automated testing.'
  },
  {
    name: 'Docker',
    icon: 'view_in_ar',
    description: 'Containerization for consistent deployments.'
  }
];
}
