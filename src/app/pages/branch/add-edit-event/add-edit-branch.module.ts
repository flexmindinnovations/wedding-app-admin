import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditBranchPageRoutingModule } from './add-edit-branch-routing.module';

import { AddEditBranchComponent } from './add-edit-event.component';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditBranchPageRoutingModule,
    SharedModule
  ],
  declarations: [AddEditBranchComponent]
})
export class AddEditBranchPageModule { }
