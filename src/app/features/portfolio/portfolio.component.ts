import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  demoLink?: string;
  isInternal?: boolean;
  alert?:string
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
      title: 'Budget Tracker',
      description: 'A web application to help users track their income and expenses and visualize their financial health through charts.' +
                  'Depending on environment all data are stored locally or in the browser.',
      technologies: ['.NET Core', 'C#', 'EF Core', 'MS SQL','Angular', 'TypeScript', 'Plotly.js'],
      demoLink: 'budget/overview',
      isInternal: true,
      alert: 'Onine version of project use mocked data, so some functionalities can not work as expected. To test full functionality please visit the repository and run application locally.',
      codeLink: 'https://github.com/LukaSpace?tab=repositories',
    },
    {
      title: 'Portfolio Website',
      description: 'A personal portfolio website to showcase my projects, skills, and experience as a developer. ' +
                   'The website is built using Angular and features a responsive design, animations, and a contact form.',
      technologies: ['Angular', 'TypeScript', 'SCSS', 'Animations', 'Email Client'],
      demoLink: '#',
      codeLink: 'https://github.com/LukaSpace/main',
    }
  ];

  comercialProjects: Project[] = [
    {
      title: 'Products Portfolio',
      description: 'A web application showcasing a range of commercial products with detailed descriptions and images. ' +
                   'The application read data from exported .xml files, parse them and display the information in a user-friendly interface.' +
                   'All data are stored in a MS SQL database and refresh each day using a scheduled job.',
      technologies: ['.NET Core', 'C#', 'EF Core', 'MS SQL', 'XUnit','Angular', 'Rest API', 'Hangfire', 'Animations', 'Azure CD/CI'],
    },
  ];

  onDemoRun(alertMsg?: string) {
    if (alertMsg)
      this.snackBar.open(alertMsg, undefined, { duration: 8000 });
  }
}