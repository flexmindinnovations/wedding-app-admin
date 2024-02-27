import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditCustomerPageRoutingModule } from './add-edit-customer-routing.module';

import { AddEditCustomerPage } from './add-edit-customer.page';
import { SharedModule } from 'src/app/shared.module';
import { ContactInfoComponent } from 'src/app/components/registerartion-process/contact-info/contact-info.component';
import { FamilyInfoComponent } from 'src/app/components/registerartion-process/family-info/family-info.component';
import { OtherInfoComponent } from 'src/app/components/registerartion-process/other-info/other-info.component';
import { PersonalInfoComponent } from 'src/app/components/registerartion-process/personal-info/personal-info.component';
import { PhotosComponent } from 'src/app/components/registerartion-process/photos/photos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditCustomerPageRoutingModule,
    SharedModule
  ],
  declarations:
    [
      AddEditCustomerPage,
      PersonalInfoComponent,
      FamilyInfoComponent,
      ContactInfoComponent,
      OtherInfoComponent,
      PhotosComponent
    ]
})
export class AddEditCustomerPageModule { }
