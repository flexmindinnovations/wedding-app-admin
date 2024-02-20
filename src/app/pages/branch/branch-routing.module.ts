import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchPage } from './branch.page';
import { AddEditBranchComponent } from './add-edit-event/add-edit-event.component';

const routes: Routes = [
  {
    path: '',
    component: BranchPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add-edit-event/add-edit-branch-routing.module').then(m => m.AddEditBranchPageRoutingModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./add-edit-event/add-edit-branch-routing.module').then(m => m.AddEditBranchPageRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchPageRoutingModule { }
