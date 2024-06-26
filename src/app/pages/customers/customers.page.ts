import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams, GridApi } from 'ag-grid-community';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';
import * as moment from 'moment';
import { GridCellImageComponent } from 'src/app/components/grid-cell-image/grid-cell-image.component';
import { GridCellStatusComponent } from 'src/app/components/grid-cell-status/grid-cell-status.component';
import { RolesService } from 'src/app/services/role/roles.service';
import { RegisterCustomerComponent } from 'src/app/modals/register-customer/register-customer.component';
import { ModalController } from '@ionic/angular';
import { FormStep } from 'src/app/interfaces/form-step-item';
import { StepPath } from 'src/util/util';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteConfirmComponent } from 'src/app/modals/delete-confirm/delete-confirm.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth.service';


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
  sharedService = inject(SharedService);
  userService = inject(UserService);
  rowData: any = [];
  filteredRowData: any[] = [];
  searchQuery: string = '';
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
      field: "isActive",
      width: 100,
      pinned: 'right',
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

  constructor( private authService: AuthService) {
  }

  ngOnChanges() {
    this.filterData();
  }

  ngOnInit() {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.getCustomerList();
    }
    
  }

  ngAfterViewInit(): void {
    this.customerRegistrationService.getRequestStatus().subscribe(isCompleted => {
      if (isCompleted) this.getCustomerList();
    })
  }

  filterData() {
    this.filteredRowData = this.rowData.filter((row: any) => {
      // Perform case-insensitive search on each row's data
      return row.fullName.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }

  getPermissionListByRoleId(): any {
    const roleId = localStorage.getItem('role');
    this.roleService.getPermissionListById(roleId).subscribe({
      next: (permissionList: any) => {
        if (permissionList) {
          const newList = permissionList?.filter((item: any) => item?.moduleName === 'Customers')[0];
          this.isAddActive = newList?.canAdd;
          const refData = { fromCustomerPage: true, canEdit: newList?.canEdit, canDelete: newList?.canDelete };
          this.rowData = this.rowData?.map((item: any) => {
            item['refData'] = refData;
            return item;
          })
          this.filteredRowData = [...this.rowData];
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  getCustomerList() {
    this.customerService.getCustomerList().subscribe({
      next: async (data: any) => {
        if (data) {
          this.rowData = data.map((item: any) => {
            return {
              ...item,
              isActive: item['customerStatus'],
              registrationDate: moment(item['registrationDate']).format('DD/MM/YYYY')
            }
          });
          this.getPermissionListByRoleId();
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
      htmlAttributes: {
        width: '30%'
      },
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
      this.redirectToIncompleteStep(data);
    } else {
      this.showDeleteConfirmDialog(event);
    }
  }

  async showDeleteConfirmDialog(event: any) {
    let fullName = event?.rowData?.fullName;
    fullName = fullName.replace(/\s/g, '').length > 0 ? fullName : null;
    this.canShowModal = true;
    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    const modal = await this.modalCtrl.create({
      component: DeleteConfirmComponent,
      backdropDismiss: false,
      componentProps: {
        data: {
          title: 'Delete: ' + (fullName ? fullName : 'Customer'),
          data: { ...event, message: 'Are you sure you want to delete customer?  This action cannot be undone.' }
        },
      },
      cssClass: 'delete-confirm-modal'
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const eventType = data?.data?.event;
    if (eventType === 'delete') {
      this.deleteCustomer(event?.rowData);
    }
  }

  deleteCustomer(event: any) {
    this.userService.deleteCustomer(event?.customerId).subscribe({
      next: (response: any) => {
        if (response) {
          this.alertService.setAlertMessage(response?.message, AlertType.success);
          this.getCustomerList();
        }
      },
      error: (error: any) => {
        if (error) {
          this.alertService.setAlertMessage('Error: Something went wrong', AlertType.error);
        }
      }
    })
  }

  refreshGridData() {
    this.getCustomerList();
  }

  redirectToIncompleteStep(data: any) {
    const customerId = data?.customerId;
    this.customerService.getCustomerDetailsById(customerId).subscribe({
      next: (data: any) => {
        if (data) {

          const { isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded, isPaymentInfoFill } = data;
          if (customerId) {
            if (!isPersonInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/personal`);
            else if (!isFamilyInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/family`);
            else if (!isContactInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/contact`);
            else if (!isOtherInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/other`);
            else if (!isImagesAdded) this.router.navigateByUrl(`customers/edit/${customerId}/photos`);
            else if (!isPaymentInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/payment`);
            else this.router.navigateByUrl(`customers/edit/${customerId}/personal`);
            this.setStepperData(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded, isPaymentInfoFill);
          }
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong', AlertType.error);
      }
    })
  }

  setStepperData(isPersonInfoFill: boolean, isFamilyInfoFill: boolean, isContactInfoFill: boolean, isOtherInfoFill: boolean, isImagesAdded: boolean, isPaymentInfoFill: boolean) {
    const props: FormStep = {
      source: this.getSource(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded, isPaymentInfoFill),
      data: {},
      formId: 1,
      active: true,
      isCompleted: isPersonInfoFill,
      previous: null,
      completeKey: StepPath.PERSONAL,
      steps: { personal: isPersonInfoFill, family: isFamilyInfoFill, contact: isContactInfoFill, other: isOtherInfoFill, photos: isImagesAdded, payment: isPaymentInfoFill }
    }
    this.sharedService.stepData.next(props);
  }

  getSource(isPersonInfoFill: boolean, isFamilyInfoFill: boolean, isContactInfoFill: boolean, isOtherInfoFill: boolean, isImagesAdded: boolean, isPaymentInfoFill: boolean) {
    if (!isPersonInfoFill) return StepPath.PERSONAL;
    else if (!isFamilyInfoFill) return StepPath.FAMILY;
    else if (!isContactInfoFill) return StepPath.CONTACT;
    else if (!isOtherInfoFill) return StepPath.OTHER;
    else if (!isImagesAdded) return StepPath.PHOTOS;
    else if (!isPaymentInfoFill) return StepPath.PAYMENT;
    else return StepPath.PERSONAL;
  }

  ngOnDestroy(): void { }

}
