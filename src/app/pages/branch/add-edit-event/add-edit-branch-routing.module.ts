import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditBranchComponent } from './add-edit-event.component';

const routes: Routes = [
  {
    path: '',
    component: AddEditBranchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditBranchPageRoutingModule { }
