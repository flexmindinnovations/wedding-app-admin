import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersPage } from './customers.page';

const routes: Routes = [
  {
    path: '',
    component: CustomersPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add-edit-customer/add-edit-customer.module').then(m => m.AddEditCustomerPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./add-edit-customer/add-edit-customer.module').then(m => m.AddEditCustomerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersPageRoutingModule { }
