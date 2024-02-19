import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditBranchPageRoutingModule } from './add-edit-branch-routing.module';

import { AddEditBranchPage } from './add-edit-branch.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditBranchPageRoutingModule,
    SharedModule
  ],
  declarations: [AddEditBranchPage]
})
export class AddEditBranchPageModule { }
