import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditUserPageRoutingModule } from './add-edit-user-routing.module';

import { AddEditUserPage } from './add-edit-user.page';
import { SharedModule } from 'src/app/shared.module';
import { InputComponent } from 'src/app/components/input/input.component';
import { PersonalInfoComponent } from 'src/app/components/registerartion-process/personal-info/personal-info.component';

@NgModule({
  declarations: [
    AddEditUserPage,
    InputComponent,
    PersonalInfoComponent,
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
