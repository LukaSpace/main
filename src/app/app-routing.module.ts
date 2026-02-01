import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './features/contact/contact.component';
import { TechnologiesComponent } from './features/technologies/technologies.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/main/main.module').then(m => m.MainModule),
    },
    {
        path: 'blog',
        loadChildren: () => import('./features/blog/blog.module').then(m => m.BlogModule),
    },
    {
        path: 'portfolio',
        loadChildren: () => import('./features/portfolio/portfolio.module').then(m => m.PortfolioModule),
    },
    {
        path: 'portfolio/budget',
        loadChildren: () => import('./features/portfolio/budget/budget.module').then(m => m.BudgetModule),
    },
    {
        path: 'contact',
        component: ContactComponent 
    },
    {
        path: 'technologies',
        component: TechnologiesComponent
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

