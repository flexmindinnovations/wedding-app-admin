import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditCustomerPage } from './add-edit-customer.page';
import { PersonalInfoComponent } from 'src/app/components/registerartion-process/personal-info/personal-info.component';
import { FamilyInfoComponent } from 'src/app/components/registerartion-process/family-info/family-info.component';
import { ContactInfoComponent } from 'src/app/components/registerartion-process/contact-info/contact-info.component';
import { OtherInfoComponent } from 'src/app/components/registerartion-process/other-info/other-info.component';
import { PhotosComponent } from 'src/app/components/registerartion-process/photos/photos.component';


const route = window.location.href;
const isAddAction = route.indexOf('add') > 1;

const routes: Routes = [
  {
    path: '',
    redirectTo: 'personal',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AddEditCustomerPage,
    children: [
      {
        path: 'personal',
        component: PersonalInfoComponent
      },
      {
        path: 'family',
        component: FamilyInfoComponent
      },
      {
        path: 'contact',
        component: ContactInfoComponent
      },
      {
        path: 'other',
        component: OtherInfoComponent
      },
      {
        path: 'photos',
        component: PhotosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditCustomerPageRoutingModule { }
