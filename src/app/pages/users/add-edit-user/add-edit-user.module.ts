import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditUserPageRoutingModule } from './add-edit-user-routing.module';

import { AddEditUserPage } from './add-edit-user.page';
import { SharedModule } from 'src/app/shared.module';
import { InputComponent } from 'src/app/components/input/input.component';
import { PersonalInfoComponent } from 'src/app/components/registerartion-process/personal-info/personal-info.component';
import { FamilyInfoComponent } from 'src/app/components/registerartion-process/family-info/family-info.component';
import { ContactInfoComponent } from 'src/app/components/registerartion-process/contact-info/contact-info.component';
import { OtherInfoComponent } from 'src/app/components/registerartion-process/other-info/other-info.component';
import { PhotosComponent } from 'src/app/components/registerartion-process/photos/photos.component';

@NgModule({
  declarations: [
    AddEditUserPage,
    // PersonalInfoComponent,
    // FamilyInfoComponent,
    // ContactInfoComponent,
    // OtherInfoComponent,
    // PhotosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AddEditUserPageRoutingModule
  ],
})
export class AddEditUserPageModule {}
