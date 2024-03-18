import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditEventPage } from './add-edit-event.page';

const route = window.location.href;
const isAddAction = route.indexOf('add') > 1;
const routes: Routes = [
  {
    path: '',
    component: AddEditEventPage,
    data: {
      route: isAddAction ? 'add' : 'edit',
      pageName: `${isAddAction ? 'Add' : 'Edit'} Event`,
      title: `${isAddAction ? 'Add' : 'Edit'} Event`,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditEventPageRoutingModule {}
