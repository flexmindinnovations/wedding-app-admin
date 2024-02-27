import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchPage } from './branch.page';

const routes: Routes = [
  {
    path: '',
    component: BranchPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add-edit-branch/add-edit-branch.module').then(m => m.AddEditBranchPageModule)
  },
  {
    path: 'edit/:branchId',
    loadChildren: () => import('./add-edit-branch/add-edit-branch.module').then(m => m.AddEditBranchPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchPageRoutingModule { }
