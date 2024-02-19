import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditUserPage } from './add-edit-user.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditUserPageRoutingModule {}
