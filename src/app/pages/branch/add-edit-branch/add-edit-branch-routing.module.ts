import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditBranchPage } from './add-edit-branch.page';

const route = window.location.href;
const isAddAction = route.indexOf('add') > 1;

const routes: Routes = [
  {
    path: '',
    component: AddEditBranchPage,
    data: {
      route: isAddAction ? 'add' : 'edit',
      pageName: `${isAddAction ? 'Add' : 'Edit'} Branch`,
      title: `${isAddAction ? 'Add' : 'Edit'} Branch`,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditBranchPageRoutingModule { }
