import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './features/contact/contact.component';

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
        path: 'contact',
        component: ContactComponent 
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

