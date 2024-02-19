import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditEventPageRoutingModule } from './add-edit-event-routing.module';

import { AddEditEventPage } from './add-edit-event.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditEventPageRoutingModule,
    SharedModule
  ],
  declarations: [AddEditEventPage]
})
export class AddEditEventPageModule {}
