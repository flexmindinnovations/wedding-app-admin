import { Component, Inject, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridCellImageComponent } from 'src/app/components/grid-cell-image/grid-cell-image.component';
import { GridCellStatusComponent } from 'src/app/components/grid-cell-status/grid-cell-status.component';
import { AlertType } from 'src/app/enums/alert-types';
import { GridActions } from 'src/app/enums/grid-actions';
import { IBranch } from 'src/app/interfaces/IBranch';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { RolesService } from 'src/app/services/role/roles.service';
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
  alertService = inject(AlertService);
  roleService = inject(RolesService);
  isAddActive: boolean = false;

  rowData: IBranch[] = [];
  colDefs: ColDef[] = [
    { field: "branchId", headerName: '#Id', width: 100 },
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

  constructor( private authService: AuthService) {
  }

  ngOnInit() {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.getBranchList();
      this.getPermissionListByRoleId();
    }
    this.branchService.getUpdate().subscribe(() => {
      this.getBranchList();
    });
  }

  getPermissionListByRoleId() {
    const roleId = localStorage.getItem('role');
    this.roleService.getPermissionListById(roleId).subscribe({
      next: (permissionList: any) => {
        if (permissionList) {
          const newList = permissionList?.filter((item: any) => item?.moduleName === 'Branch')[0];
          this.isAddActive = newList?.canAdd;
          const refData = { canEdit: newList?.canEdit, canDelete: newList?.canDelete };
          this.rowData = this.rowData?.map((item: any) => {
            item['refData'] = refData;
            return item;
          })
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage(error?.message, AlertType.error);
      }
    })
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
    this.router.navigateByUrl('branch/add', { state: { route: 'add', pageName: 'Add Branch', title: 'Add Branch' } });
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    if (action === GridActions.edit) {
      this.sidebarItemService.setCurrentPage('Edit Branch');
      this.router.navigateByUrl(`branch/edit/${data?.branchId}`, { state: { route: 'edit', pageName: 'Edit Branch', title: 'Edit Branch' } })
    } else {
      // console.log('>>>>> event delete: ', event);
    }
  }

}