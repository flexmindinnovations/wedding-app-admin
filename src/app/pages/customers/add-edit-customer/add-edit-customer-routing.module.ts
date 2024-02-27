import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditCustomerPage } from './add-edit-customer.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditCustomerPageRoutingModule {}
