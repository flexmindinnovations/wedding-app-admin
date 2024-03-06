import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {

  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  customerService = inject(CustomerRegistrationService);
  alertService = inject(AlertService);

  rowData: any = [];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: "customerId", headerName: '#id', width: 60 },
    { field: "fullName", width: 400 },
    { field: "mobileNo", width: 150 },
    // { field: "country" },
    // { field: "state" },
    // { field: "city" },
    {
      field: "action",
      pinned: 'right',
      width: 100,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridButtonsComponent,
        onClick: this.handleGridActionButtonClick.bind(this)
      } as IGroupCellRendererParams
    },
  ];

  ngOnInit() {
    this.getCustomerList();
  }

  getCustomerList(): void {
    this.customerService.getCustomerList().subscribe({
      next: (data: any) => {
        this.rowData = data;
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

  handleClick() {
    this.sidebarItemService.setCurrentPage('Add Customer');
    this.router.navigateByUrl('customers/add');
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    if (action === GridActions.edit) {
      this.router.navigateByUrl(`customers/edit/${data?.customerId}`);
    } else {
      console.log('>>>>> event delete: ', event);
    }
  }

  ngOnDestroy(): void { }

}
