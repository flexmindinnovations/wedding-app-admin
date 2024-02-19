import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './users.page';

const routes: Routes = [
  {
    path: '',
    component: UsersPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add-edit-user/add-edit-user.module').then( m => m.AddEditUserPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./add-edit-user/add-edit-user.module').then( m => m.AddEditUserPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
