import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditBlogPage } from './add-edit-blog.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditBlogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditBlogPageRoutingModule {}
