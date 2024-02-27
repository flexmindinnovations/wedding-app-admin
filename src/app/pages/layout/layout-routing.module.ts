import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPage } from './layout.page';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
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
        path: 'branch',
        loadChildren: () =>
          import('../../pages/branch/branch.module').then(m => m.BranchPageModule)
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('../../pages/blog/blog.module').then(m => m.BlogPageModule)
      },
      {
        path: 'Other',
        loadChildren: () =>
          import('../../pages/master/master.module').then(m => m.MasterPageModule)
      },
      {
        path: '**',
        loadChildren: () =>
          import('../../pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule { }
