import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {

  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  frameworkComponents: any;
  rowData = [];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: "id", width: 100},
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

  constructor() {
    this.frameworkComponents = {
      buttonRenderer: GridButtonsComponent
    }
  }

  ngOnInit() {
  }

  handleClick() {
    this.sidebarItemService.setCurrentPage('Add New Blog Page')
    this.router.navigateByUrl('blog/add');
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    if(action === GridActions.edit) {
      this.router.navigateByUrl(`blog/edit/${data?.id}`)
    } else {
      console.log('>>>>> event delete: ', event);
    }
  }
}
