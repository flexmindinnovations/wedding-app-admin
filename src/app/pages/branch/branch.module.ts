import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BranchPageRoutingModule } from './branch-routing.module';

import { BranchPage } from './branch.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BranchPageRoutingModule,
    SharedModule
  ],
  declarations: [BranchPage]
})
export class BranchPageModule { }
