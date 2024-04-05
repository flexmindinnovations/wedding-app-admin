import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
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
import { RolesService } from 'src/app/services/role/roles.service';
import { RegisterCustomerComponent } from 'src/app/modals/register-customer/register-customer.component';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, AfterViewInit {

  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  customerService = inject(CustomerRegistrationService);
  alertService = inject(AlertService);
  rowData: any = [];
  roleService = inject(RolesService);
  isAddActive: boolean = false;
  customerRegistrationService = inject(CustomerRegistrationService);
  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);
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
      field: "isActiive",
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
    this.getPermissionListByRoleId();
  }

  ngAfterViewInit(): void {
    this.customerRegistrationService.getRequestStatus().subscribe(isCompleted => {
      if (isCompleted) this.getCustomerList();
    })
  }

  getPermissionListByRoleId() {
    const roleId = localStorage.getItem('role');
    this.roleService.getPermissionListById(roleId).subscribe({
      next: (permissionList: any) => {
        if (permissionList) {
          const newList = permissionList?.filter((item: any) => item?.moduleName === 'Customers')[0];
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

  getCustomerList(): void {
    this.customerService.getCustomerList().subscribe({
      next: (data: any) => {
        if (data) {
          this.rowData = data.map((item: any) => {
            return {
              ...item,
              isActive: item['customerStatus'],
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
    // this.sidebarItemService.setCurrentPage('Add Customer');
    // this.router.navigateByUrl('customers/add', { state: { route: 'add', pageName: 'Add Customer', title: 'Add Customer' } });
    this.openRegisterCustomerModal();
  }
  async openRegisterCustomerModal(event?: any) {
    this.canShowModal = true;
    const userNameList = [...this.rowData?.map((user: any) => user.mobileNo)].filter((user: any) => user !== '');
    const modal = await this.modalCtrl.create({
      component: RegisterCustomerComponent,
      cssClass: 'register-customer-modal',
      componentProps: {
        data: {
          title: 'Register Customer',
          data: { ...event, userNameList }
        }
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['add'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      this.getCustomerList();
    }
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    if (action === GridActions.edit) {
      this.router.navigateByUrl(`customers/edit/${data?.customerId}`, { state: { route: 'edit', pageName: 'Edit Customer', title: 'Edit Customer' } });
    } else {
      // console.log('>>>>> event delete: ', event);
    }
  }

  ngOnDestroy(): void { }

}
