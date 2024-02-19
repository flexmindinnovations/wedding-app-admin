import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditBlogPageRoutingModule } from './add-edit-blog-routing.module';

import { AddEditBlogPage } from './add-edit-blog.page';
import { SharedModule } from 'src/app/shared.module';

import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditBlogPageRoutingModule,
    QuillModule.forRoot(),
    SharedModule
  ],
  declarations: [AddEditBlogPage]
})
export class AddEditBlogPageModule {}
