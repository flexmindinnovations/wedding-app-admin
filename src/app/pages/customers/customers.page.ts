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
import { FormStep } from 'src/app/interfaces/form-step-item';
import { StepPath } from 'src/util/util';
import { SharedService } from 'src/app/services/shared.service';



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

  ngOnChanges() {
    this.filterData();
  }

  ngOnInit() {
    this.getCustomerList();
    this.getPermissionListByRoleId();
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
          this.filteredRowData = [...this.rowData];
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
      // console.log('>>>>> event delete: ', event);
    }
  }

  redirectToIncompleteStep(data: any) {
    const customerId = data?.customerId;
    this.customerService.getCustomerDetailsById(customerId).subscribe({
      next: (data: any) => {
        if (data) {
          const { isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded } = data;
          if (customerId) {
            if (!isPersonInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/personal`);
            else if (!isFamilyInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/family`);
            else if (!isContactInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/contact`);
            else if (!isOtherInfoFill) this.router.navigateByUrl(`customers/edit/${customerId}/other`);
            else if (!isImagesAdded) this.router.navigateByUrl(`customers/edit/${customerId}/photos`);
            else this.router.navigateByUrl(`customers/edit/${customerId}/personal`);
            this.setStepperData(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded);
          }
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong', AlertType.error);
      }
    })
  }

  setStepperData(isPersonInfoFill: boolean, isFamilyInfoFill: boolean, isContactInfoFill: boolean, isOtherInfoFill: boolean, isImagesAdded: boolean) {
    const props: FormStep = {
      source: this.getSource(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded),
      data: {},
      formId: 1,
      active: true,
      isCompleted: isPersonInfoFill,
      previous: null,
      completeKey: StepPath.PERSONAL,
      steps: { personal: isPersonInfoFill, family: isFamilyInfoFill, contact: isContactInfoFill, other: isOtherInfoFill, photos: isImagesAdded }
    }
    this.sharedService.stepData.next(props);
  }

  getSource(isPersonInfoFill: boolean, isFamilyInfoFill: boolean, isContactInfoFill: boolean, isOtherInfoFill: boolean, isImagesAdded: boolean) {
    if (!isPersonInfoFill) return StepPath.PERSONAL;
    else if (!isFamilyInfoFill) return StepPath.FAMILY;
    else if (!isContactInfoFill) return StepPath.CONTACT;
    else if (!isOtherInfoFill) return StepPath.OTHER;
    else if (!isImagesAdded) return StepPath.PHOTOS;
    else return StepPath.PERSONAL;
  }

  ngOnDestroy(): void { }

}
