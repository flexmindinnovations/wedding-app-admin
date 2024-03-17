import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditCustomerPage } from './add-edit-customer.page';

const route = window.location.href;
const isAddAction = route.indexOf('add') > 1;

const routes: Routes = [
  {
    path: '',
    component: AddEditCustomerPage,
    data: {
      route: isAddAction ? 'add' : 'edit',
      pageName: `${isAddAction ? 'Add' : 'Edit'} Customer`,
      title: `${isAddAction ? 'Add' : 'Edit'} Customer`,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditCustomerPageRoutingModule { }
