import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss',
  imports: [MatCardModule, MatIconModule],
})
export class TechnologiesComponent {
  technologies = [
    {
      type: 'Backend',
      items: [
        {
          name: 'C#',
          icon: 'code',
          description: 'Business logic, calculations, and data processing.',
        },
        {
          name: 'AutoMapper',
          icon: 'transform',
          description: 'Object-object mapping for .NET.',
        },
        {
          name: 'Hangfire',
          icon: 'schedule',
          description: 'Background job processing in .NET applications.',
        },
        {
          name: 'Serilog',
          icon: 'receipt_long',
          description: 'Structured logging for .NET applications.',
        },
        {
          name: 'RabbitMQ',
          icon: 'sync_alt',
          description: 'Message broker for asynchronous communication.',
        },
      ],
    },
    {
      type: 'Frontend',
      items: [
        {
          name: 'Angular',
          icon: 'web',
          description: 'Frontend applications.',
        },
        {
          name: 'Material Design',
          icon: 'design_services',
          description: 'UI component library for Angular.',
        },
        {
          name: 'NgRx',
          icon: 'sync',
          description: 'State management for Angular applications.',
        },
        {
          name: 'Tailwind',
          icon: 'palette',
          description: 'Utility-first CSS for fast UI development.',
        },
        {
          name: 'RxJS',
          icon: 'sync_alt',
          description: 'Reactive programming for asynchronous data streams.',
        },
        {
          name: 'SignalR',
          icon: 'wifi',
          description: 'Real-time web functionality.',
        },
      ],
    },
    {
      type: 'Data Storage',
      items: [
        {
          name: 'Microsoft SQL',
          icon: 'folder_shared',
          description: 'Database design and data management.',
        },
        {
          name: 'Redis',
          icon: 'memory',
          description: 'In-memory data structure store for caching and messaging.',
        },
        {
          name: 'EF Core',
          icon: 'storage',
          description: 'ORM for .NET applications.',
        },
      ],
    },
    {
      type: 'DevOps & Tools',
      items: [
        {
          name: 'Azure DevOps',
          icon: 'dashboard',
          description: 'Work planning and task management.',
        },
        {
          name: 'Azure Pipelines',
          icon: 'autorenew',
          description: 'Implementing CI/CD pipelines.',
        },
        {
          name: 'Docker',
          icon: 'view_in_ar',
          description: 'Containerization for consistent deployments.',
        },
        {
          name: 'Git',
          icon: 'merge_type',
          description: 'Version control and collaboration.',
        },
        {
          name: 'Azure Portal',
          icon: 'cloud',
          description: 'Cloud services and infrastructure management.',
        },
      ],
    },
    {
      type: 'Testing, Documentation & AI Assistance ',
      items: [
        {
          name: 'xUnit / NUnit',
          icon: 'fact_check',
          description: 'Frameworks for automated testing.',
        },
        {
          name: 'Swagger',
          icon: 'description',
          description: 'API documentation and testing.',
        },
        {
          name: 'Github Copilot',
          icon: 'smart_toy',
          description: 'AI-powered code completion and suggestions.',
        },
      ],
    },
  ];
}
