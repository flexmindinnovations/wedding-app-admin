import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditBranchPage } from './add-edit-branch.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditBranchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditBranchPageRoutingModule {}
