import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BranchPageRoutingModule } from './branch-routing.module';

import { BranchPage } from './branch.page';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from 'src/app/shared.module';
import { AddEditBranchComponent } from './add-edit-branch/add-edit-branch.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BranchPageRoutingModule,
    SharedModule
  ],
  declarations: [BranchPage, AddEditBranchComponent]
})
export class BranchPageModule { }
