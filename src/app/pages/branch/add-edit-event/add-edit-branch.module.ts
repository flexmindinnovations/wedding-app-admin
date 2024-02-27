import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditBranchPageRoutingModule } from './add-edit-branch-routing.module';

import { AddEditBranchComponent } from './add-edit-event.component';
import { SharedModule } from 'src/app/shared.module';
import { ImagePickerComponent } from 'src/app/components/image-picker/image-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditBranchPageRoutingModule,
    SharedModule
  ],
  declarations: [AddEditBranchComponent, ImagePickerComponent]
})
export class AddEditBranchPageModule { }
