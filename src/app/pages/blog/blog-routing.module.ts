import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogPage } from './blog.page';

const routes: Routes = [
  {
    path: '',
    component: BlogPage,
  },
  {
    path: 'add',
    loadChildren: () => import('./add-edit-blog/add-edit-blog.module').then(m => m.AddEditBlogPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./add-edit-blog/add-edit-blog.module').then(m => m.AddEditBlogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogPageRoutingModule {}
