import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  demoLink?: string;
  isInternal?: boolean;
  alert?: string;
  codeLink?: string;
}
@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  constructor(private snackBar: MatSnackBar) {}

  myProjects: Project[] = [
    {
      title: 'Portfolio Website',
      description:
        'A personal portfolio website to showcase my projects, skills, and experience as a developer. ' +
        'The website is built using Angular and features a responsive design, animations, and a contact form. ',
      technologies: ['Angular', 'Material Design', 'Animations', 'Responsive Design', 'Mailto Links'],
      demoLink: '/',
      isInternal: true,
      codeLink: 'https://github.com/LukaSpace/main/',
    },
    {
      title: 'Budget Tracker',
      description:
        'A web application to help users track their income and expenses and visualize their financial health through charts. ' +
        'Depending on environment all data are stored locally or in the browser.',
      technologies: ['.NET Core', 'C#', 'EF Core', 'MS SQL', 'Angular', 'Plotly.js'],
      demoLink: 'budget/overview',
      isInternal: true,
      alert: 'Onine version of project use mocked data, so some functionalities can not work as expected. To test full functionality please visit the repository and run application locally.',
      codeLink: 'https://dev.azure.com/lukaSpace/BudgetAPI/_git/BudgetAPI',
    },
  ];

  comercialProjects: Project[] = [
    {
      title: 'Annual Energy Production Calculation Service',
      description:
        'A web application designed to calculate the annual energy production of a wind turbine park. ' +
        'The application takes into account various factors such as wind speed, turbine specifications, and environmental conditions to provide accurate energy production estimates. ' +
        'The application also includes features for data visualization and reporting.',
      technologies: [
        '.NET Core',
        'Angular',
        'Azure CD/CI',
        'C#',
        'EF Core',
        'Hangfire',
        'JSON Parsing',
        'JWT Authentication',
        'MVC',
        'MS SQL',
        'Plotly.js',
        'Rest API',
        'Services Architecture',
        'XUnit',
      ],
    },
    {
      title: 'Products Portfolio',
      description:
        'A web application showcasing a range of commercial products with detailed descriptions and images. ' +
        'The application read data from exported .xml files, parse them and display the information in a user-friendly interface. ' +
        'All data are stored in a MS SQL database and refresh each day using a scheduled job.',
      technologies: ['.NET Core', 'Angular', 'Animations', 'Azure CD/CI', 'C#', 'EF Core', 'Hangfire', 'JWT Authentication', 'MS SQL', 'MVC', 'Rest API', 'Tailwind CSS', 'XML Parsing', 'XUnit'],
    },
    {
      title: 'Migration of Legacy Application',
      description:
        'A project focused on migrating a legacy VB application to a modern technology stack. ' +
        'The migration process involved analyzing the existing application, designing a new architecture, and implementing the new application using Angular 21 and .NET 10. with Telerik UI. ' +
        'The project also included data migration, testing, and supporting old project files according to stackholders requirements.',
      technologies: ['.NET Core', 'C#', 'MVVM', 'MVVM Toolkit', 'Math.NET Numerics', 'MiniExcel', 'Siemens NX Open API', 'Telerik UI', 'WPF', 'XUnit'],
    },
  ];

  onDemoRun(alertMsg?: string) {
    if (alertMsg) this.snackBar.open(alertMsg, 'OK', { duration: 12000 });
  }
}
