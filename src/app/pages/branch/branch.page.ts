import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridCellImageComponent } from 'src/app/components/grid-cell-image/grid-cell-image.component';
import { GridCellStatusComponent } from 'src/app/components/grid-cell-status/grid-cell-status.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { IBranch } from 'src/app/interfaces/IBranch';
import { BranchService } from 'src/app/services/branch/branch.service';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
@Component({
  selector: 'app-branch',
  templateUrl: './branch.page.html',
  styleUrls: ['./branch.page.scss'],
})
export class BranchPage implements OnInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  branchService = inject(BranchService);

  rowData: IBranch[] = [];

  // Column Definitions: Defines & controls grid columns.

  colDefs: ColDef[] = [
    { field: "branchId", headerName: '#Id', width: 60 },
    {
      field: "branchImagePath",
      headerName: 'Image',
      wrapText: true,
      autoHeaderHeight: true,
      width: 100,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridCellImageComponent,
      } as IGroupCellRendererParams
    },
    { field: "branchName", width: 315 },
    { field: "countryName", headerName: 'Country' },
    { field: "stateName", headerName: 'State', width: 200 },
    { field: "cityName", headerName: 'City', width: 150 },
    {
      field: "isActive",
      width: 100,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridCellStatusComponent,
      } as IGroupCellRendererParams
    },

    {
      field: "action",
      width: 90,
      pinned: 'right',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridButtonsComponent,
        onClick: this.handleGridActionButtonClick.bind(this)
      } as IGroupCellRendererParams
    },
  ];

  ngOnInit() {
    this.getBranchList();
    this.branchService.getUpdate().subscribe(() => {
      this.getBranchList();
    });
  }

  getBranchList(): void {
    this.branchService.getBranchList().subscribe({
      next: (data: IBranch[]) => {
        // let datum = data.map(e=>)
        // console.log(data)
        this.rowData = data;

      },
      error: (error) => {
        console.log('error: ', error);

      }
    })

  }

  handleClick() {
    this.sidebarItemService.setCurrentPage('Add Branch');
    this.router.navigateByUrl('branch/add');
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    console.log('data: ', data);

    if (action === GridActions.edit) {
      this.sidebarItemService.setCurrentPage('Edit Branch');
      this.router.navigateByUrl(`branch/edit/${data?.branchId}`)
    } else {
      console.log('>>>>> event delete: ', event);
    }
  }

}