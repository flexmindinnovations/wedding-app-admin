import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BranchPageRoutingModule } from './branch-routing.module';

import { BranchPage } from './branch.page';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BranchPageRoutingModule,
    SharedModule
  ],
  declarations: [BranchPage]
})
export class BranchPageModule {}
