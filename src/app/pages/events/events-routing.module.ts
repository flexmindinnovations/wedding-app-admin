import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsPage } from './events.page';

const routes: Routes = [
  {
    path: '',
    component: EventsPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add-edit-event/add-edit-event.module').then( m => m.AddEditEventPageModule)
  },
  {
    path: 'edit/:eventId',
    loadChildren: () => import('./add-edit-event/add-edit-event.module').then( m => m.AddEditEventPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsPageRoutingModule {}
