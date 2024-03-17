import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';
import * as moment from 'moment';
import { GridCellImageComponent } from 'src/app/components/grid-cell-image/grid-cell-image.component';
import { GridCellStatusComponent } from 'src/app/components/grid-cell-status/grid-cell-status.component';


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
  colDefs: ColDef[] = [
    { field: "customerId", headerName: '#id', width: 100 },
    {
      field: "imagePath1",
      headerName: 'Image',
      wrapText: true,
      autoHeaderHeight: true,
      width: 100,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridCellImageComponent,
      } as IGroupCellRendererParams
    },
    { field: "fullName", width: 400 },
    { field: "mobileNo", width: 130 },
    { field: "emailId", width: 205 },
    { field: "registrationDate", headerName: 'Registered On', width: 120 },
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
        if(data) {
          this.rowData = data.map((item: any) => {
            return {
              ...item,
              registrationDate: moment(item['registrationDate']).format('DD/MM/YYYY')
            }
          });
        }
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
