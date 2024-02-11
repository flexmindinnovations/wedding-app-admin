import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from '../header/header.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IonicModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
