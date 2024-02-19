import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditEventPage } from './add-edit-event.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditEventPageRoutingModule {}
