import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../../pages/users/users.module').then(m => m.UsersPageModule)
  },
  {
    path: 'events',
    loadChildren: () =>
      import('../../pages/events/events.module').then(m => m.EventsPageModule)
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('../../pages/blog/blog.module').then(m => m.BlogPageModule)
  },
  {
    path: '**',
    loadChildren: () =>
      import('../../pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
