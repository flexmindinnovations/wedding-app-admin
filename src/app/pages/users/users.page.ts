import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);

  rowData = [
    { id: 1, title: "Test Title", date: new Date(), country: "India", state: "Maharashtra", city: "Nanded" },
    { id: 2, title: "Test Title", date: new Date(), country: "India", state: "Maharashtra", city: "Nanded" },
    { id: 3, title: "Test Title", date: new Date(), country: "India", state: "Maharashtra", city: "Nanded" },
    { id: 4, title: "Test Title", date: new Date(), country: "India", state: "Maharashtra", city: "Nanded" }
  ];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: "id", width: 60 },
    { field: "title" },
    { field: "date" },
    { field: "country" },
    { field: "state" },
    { field: "city" },
    {
      field: "action",
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridButtonsComponent,
        onClick: this.handleGridActionButtonClick.bind(this)
      } as IGroupCellRendererParams
    },
  ];

  ngOnInit() {
  }

  handleClick() {
    this.sidebarItemService.setCurrentPage('Add User');
    this.router.navigateByUrl('users/add');
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    if (action === GridActions.edit) {
      this.router.navigateByUrl(`users/edit/${data?.id}`)
    } else {
      console.log('>>>>> event delete: ', event);
    }
  }

  ngOnDestroy(): void { }

}
