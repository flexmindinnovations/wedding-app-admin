import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LayoutPageRoutingModule } from './layout-routing.module';

import { LayoutPage } from './layout.page';
import { SharedModule } from 'src/app/shared.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutPageRoutingModule,
    NgIdleKeepaliveModule.forRoot(),
    SharedModule
  ],
  declarations: [LayoutPage]
})
export class LayoutPageModule {}
