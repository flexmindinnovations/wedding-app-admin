import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { ModalController } from '@ionic/angular';
import { AddEditHeightComponent } from 'src/app/modals/add-edit-height/add-edit-height.component';
import { AddEditRoleComponent } from 'src/app/modals/add-edit-role/add-edit-role.component';
import { AddEditEducationComponent } from 'src/app/modals/add-edit-education/add-edit-education.component';
import { HeightService } from 'src/app/services/height/height.service';
import { EducationService } from 'src/app/services/education/education.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';
import { AddEditCastComponent } from 'src/app/modals/add-edit-cast/add-edit-cast.component';
import { CastService } from 'src/app/services/cast/cast.service';
import { HandycapService } from 'src/app/services/handycap/handycap.service';
import { AddEditHandycapComponent } from 'src/app/modals/add-edit-handycap/add-edit-handycap.component';
import { AddEditUserComponent } from 'src/app/modals/add-edit-user/add-edit-user.component';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user/user.service';
import { RolesService } from 'src/app/services/role/roles.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  educationService = inject(EducationService);
  castService = inject(CastService);
  handycapService = inject(HandycapService);
  userService = inject(UserService);
  roleService = inject(RolesService);
  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);
  heightService = inject(HeightService);
  alert = inject(AlertService);

  heightMasterRowData: any = [];
  heightMasterColumnDefs: ColDef[] = [];

  handycapMasterRowData: any = [];
  handycapMasterColumnDefs: ColDef[] = [];

  roleMasterRowData: any = [];
  roleMasterColumnDefs: ColDef[] = [];

  castMasterRowData: any = [];
  castMasterColumnDefs: ColDef[] = [];

  userMasterRowData: any = [];
  userMasterColumnDefs: ColDef[] = [];

  educationMasterRowData: any = [];
  educationMasterColumnDefs: ColDef[] = [];

  specializationMasterRowData: any = [];
  specializationMasterColumnDefs: ColDef[] = [];
  idColWidth = 80;
  isRoleActive: boolean = false;
  canRoleAdd: boolean = false;
  isHeightActive: boolean = false;
  canHeightAdd: boolean = false;
  isEducationActive: boolean = false;
  canEducationAdd: boolean = false;
  isHandyCapActive: boolean = false;
  canHandycapAdd: boolean = false;
  isUserActive: boolean = false;
  canUserAdd: boolean = false;
  isCastActive: boolean = false;
  canCastAdd: boolean = false;

  ngOnInit() {
    this.setMasterData();
    this.getPermissionListByRoleId();
  }

  getPermissionListByRoleId() {
    const roleId = localStorage.getItem('role');
    this.roleService.getPermissionListById(roleId).subscribe({
      next: (permissionList: any) => {
        if (permissionList) {
          // console.log(permissionList)
          const newList = permissionList?.filter((item: any) => item?.canView === true);
          newList.forEach((list: any) => {
            if (list?.moduleName === 'Roles') {
              this.isRoleActive = true;
              const refData = { canEdit: list?.canEdit, canDelete: list?.canDelete };
              this.canRoleAdd = list?.canAdd;
              this.roleMasterRowData = this.roleMasterRowData?.map((item: any) => {
                item['refData'] = refData;
                return item;
              })
            }
            if (list?.moduleName === 'Height') {
              this.isHeightActive = true;
              const refData = { canEdit: list?.canEdit, canDelete: list?.canDelete };
              this.canHeightAdd = list?.canAdd;
              this.heightMasterRowData = this.heightMasterRowData?.map((item: any) => {
                item['refData'] = refData;
                return item;
              })
            }
            if (list?.moduleName === 'User') {
              this.isUserActive = true;
              const refData = { canEdit: list?.canEdit, canDelete: list?.canDelete };
              this.canUserAdd = list?.canAdd;
              this.userMasterRowData = this.userMasterRowData?.map((item: any) => {
                item['refData'] = refData;
                return item;
              })
            }
            if (list?.moduleName === 'Handycap') {
              this.isHandyCapActive = true;
              const refData = { canEdit: list?.canEdit, canDelete: list?.canDelete };
              this.canHandycapAdd = list?.canAdd;
              this.handycapMasterRowData = this.handycapMasterRowData?.map((item: any) => {
                item['refData'] = refData;
                return item;
              })
            }
            if (list?.moduleName === 'Cast') {
              this.isCastActive = true;
              const refData = { canEdit: list?.canEdit, canDelete: list?.canDelete };
              this.canCastAdd = list?.canAdd;
              this.castMasterRowData = this.castMasterRowData?.map((item: any) => {
                item['refData'] = refData;
                return item;
              })
            }
            if (list?.moduleName === 'Education') {
              this.isEducationActive = true;
              const refData = { canEdit: list?.canEdit, canDelete: list?.canDelete };
              this.canEducationAdd = list?.canAdd;
              this.educationMasterRowData = this.educationMasterRowData?.map((item: any) => {
                item['refData'] = refData;
                return item;
              })
            }
          });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  setMasterData() {
    this.setHeightMasterGridData();
    this.setRoleMasterGridData();
    this.setEducationMasterGridData();
    this.setCastMasterGridData();
    this.setHandycapMasterGridData();
    this.setSpecializationMasterGridData();
    this.setUserMasterGridData();
  }

  setHeightMasterGridData() {

    this.heightMasterRowData = [];

    this.heightMasterColumnDefs = [
      { field: "id", headerName: 'Id', width: this.idColWidth },
      { field: "heightName", minWidth: 435 },
      {
        field: "action",
        colId: 'height',
        pinned: 'right',
        width: 100,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];
    this.getHeightList();
  }

  setHandycapMasterGridData() {

    this.handycapMasterRowData = [];

    this.handycapMasterColumnDefs = [
      { field: "id", headerName: 'Id', width: this.idColWidth },
      { field: "handycapName", minWidth: 435 },
      {
        field: "action",
        colId: 'handycap',
        pinned: 'right',
        width: 100,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];
    this.getHandycapList();
  }

  setCastMasterGridData() {

    this.castMasterRowData = [];

    this.castMasterColumnDefs = [
      { field: "castId", headerName: 'Id', width: this.idColWidth },
      { field: "castName", minWidth: 235 },
      { field: "hasSubcast", minWidth: 235 },
      { field: 'subCastCount', width: 235 },
      {
        field: "action",
        colId: 'cast',
        width: 100,
        pinned: 'right',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];
    this.getCastList();
  }

  setUserMasterGridData() {

    this.userMasterRowData = [];

    this.userMasterColumnDefs = [
      { field: "id", headerName: 'Id', width: this.idColWidth },
      { field: "firstName", minWidth: 235 },
      { field: "middleName", minWidth: 235 },
      { field: "lastName", minWidth: 235 },
      { field: "isActive", minWidth: 235 },
      { field: "emailId", minWidth: 235 },
      { field: 'mobileNo', width: 235 },
      { field: 'roleName', width: 235 },
      { field: "userAddress", minWidth: 235 },
      {
        field: "action",
        colId: 'user',
        width: 100,
        pinned: 'right',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];
    this.getUserList();
  }

  setRoleMasterGridData() {
    this.roleMasterColumnDefs = [
      { field: 'id', headerName: 'Id', width: this.idColWidth },
      { field: 'roleName', width: 150 },
      { field: 'roleAccess', width: 285 },
      {
        field: "action",
        colId: 'role',
        pinned: 'right',
        width: 100,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];

    this.getRolesTableData();
  }

  getRolesTableData() {
    this.roleService.getRoleList().subscribe({
      next: (data: any) => {
        if (data) {
          this.roleMasterRowData = data.map((item: any) => {
            item['id'] = item?.roleId;
            return item;
          });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Role List: ' + error?.statusText, AlertType.error);
      }
    })
  }

  setEducationMasterGridData() {
    this.educationMasterColumnDefs = [
      { field: 'id', headerName: 'Id', width: this.idColWidth },
      { field: 'educationName', width: 300 },
      { field: 'hasSpecialization', width: 155 },
      { field: 'specializationCount', width: 80 },
      {
        field: "action",
        colId: 'education',
        pinned: 'right',
        width: 100,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];

    this.getEducationTableData();
  }

  getEducationTableData() {
    this.educationService.getEducationList().subscribe({
      next: (data: any) => {
        if (data) {
          this.educationMasterRowData = data.map((item: any) => {
            item['id'] = item?.educationId;
            return item;
          });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Education List: ' + error?.statusText, AlertType.error);
      }
    })
  }

  setSpecializationMasterGridData() {

    this.specializationMasterColumnDefs = [
      { field: 'id', headerName: 'Id', width: this.idColWidth },
      { field: 'specializationName', width: 200 },
      { field: 'course', width: 235 },
      {
        field: "action",
        colId: 'specialization',
        width: 100,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];

    this.getSpecializationTableData();
  }

  getSpecializationTableData() {
    this.educationService.getSpecializationList().subscribe({
      next: (data: any) => {
        if (data) {
          this.specializationMasterRowData = data.map((item: any) => {
            const filteredItem = this.educationMasterRowData.filter((ed: any) => ed?.educationId === item?.educationId);
            item['id'] = item?.specializationId;
            item['course'] = filteredItem.length ? filteredItem[0]?.educationName : '';
            return item;
          });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Education List: ' + error?.statusText, AlertType.error);
      }
    })
  }

  handleGridAddAction(event: any) {
    const modelType = event?.type?.toLowerCase();
    switch (modelType) {
      case 'role':
        this.openAddEditRoleModal();
        break;
      case 'height':
        this.openAddEditHeightModal();
        break;
      case 'education':
        this.openAddEditEducationModal();
        break;
      case 'cast':
        this.openAddEditCastModal();
        break;
      case 'handycap':
        this.openAddEditHandycapModal();
        break;
      case 'user':
        this.openAddEditUserModal();
        break;
    }
  }

  async handleGridActionButtonClick(event: any) {
    const modelType = event?.gridId?.toLowerCase();
    if (event.src === GridActions.edit) {
      switch (modelType) {
        case 'role':
          this.openAddEditRoleModal(event);
          break;
        case 'height':
          this.openAddEditHeightModal(event);
          break;
        case 'education':
          this.openAddEditEducationModal(event);
          break;
        case 'cast':
          this.openAddEditCastModal(event);
          break;
        case 'handycap':
          this.openAddEditHandycapModal(event);
          break;
        case 'user':
          this.openAddEditUserModal(event);
          break;
      }
    } else {
      this.openDeleteConfirmationModal(event);
    }
  }

  openDeleteConfirmationModal(data: any) {
    // console.log('data: ', data);

  }

  ngOnDestroy(): void { }


  /** Modals handling */

  async openAddEditRoleModal(event?: any) {
    this.canShowModal = true;

    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    const alreadyRolesList = [...this.roleMasterRowData?.map((role: any) => role?.roleName.toLowerCase())]
    const modal = await this.modalCtrl.create({
      component: AddEditRoleComponent,
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: Role ' : 'Add New Role',
          data: { ...event, alreadyRolesList, isEditMode }
        }
      },
      cssClass: 'roles-modal'
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['add', 'update'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      this.getRolesTableData();
    }
  }

  async openAddEditHeightModal(event?: any) {
    this.canShowModal = true;

    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    let alreadyHeightList = [...this.heightMasterRowData?.map((handy: any) => handy?.heightName)]
    const refData = this.heightMasterRowData?.refData;
    const modal = await this.modalCtrl.create({
      component: AddEditHeightComponent,
      componentProps: {
        data: {
          title: isEditMode ? 'Edit Height' : 'Add New Height',
          data: { ...event, isEditMode, refData, alreadyHeightList }
        }
      },
      cssClass: 'height-modal'
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['add', 'update'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      this.getHeightList();
    }
  }

  async openAddEditHandycapModal(event?: any) {
    this.canShowModal = true;

    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    let alreadyHandicapList = [...this.handycapMasterRowData?.map((handy: any) => handy?.handycapName.toLowerCase())]
    const modal = await this.modalCtrl.create({
      component: AddEditHandycapComponent,
      componentProps: {
        data: {
          title: isEditMode ? 'Edit Handycap' : 'Add New handycap',
          data: { ...event, alreadyHandicapList, isEditMode }
        }
      },
      cssClass: 'handycap-modal'
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['add', 'update'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      this.getHandycapList();
    }
  }

  async openAddEditEducationModal(event?: any) {
    this.canShowModal = true;
    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    const alreadyEducationList = [...this.educationMasterRowData?.map((edu: any) => edu?.educationName.toLowerCase())]
    const modal = await this.modalCtrl.create({
      component: AddEditEducationComponent,
      cssClass: 'education-modal',
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: ' + event?.rowData?.educationName : 'Add New Course',
          data: { ...event, isEditMode, alreadyEducationList }
        }
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['add', 'update'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      this.getEducationTableData();
      this.getSpecializationTableData();
    }
  }

  async openAddEditUserModal(event?: any) {
    this.canShowModal = true;
    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    let alreadyUserList = [...this.userMasterRowData?.map((user: any) => user?.mobileNo)];
    const modal = await this.modalCtrl.create({
      component: AddEditUserComponent,
      cssClass: 'user-modal',
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: User ' : 'Add New User',
          data: { ...event, isEditMode, alreadyUserList }
        }
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['add', 'update'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      this.getUserList();
    }
  }

  async openAddEditCastModal(event?: any) {
    this.canShowModal = true;
    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    const alreadyCastList = [...this.castMasterRowData?.map((cast: any) => cast?.castName.toLowerCase())]
    const modal = await this.modalCtrl.create({
      component: AddEditCastComponent,
      cssClass: 'cast-modal',
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: Cast ' : 'Add New Cast',
          data: { ...event, isEditMode, alreadyCastList }
        }
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['add', 'update'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      this.getCastList();
    }
  }

  getHeightList(): any {
    this.heightService.getHeightList().subscribe({
      next: (data: any[]) => {
        this.heightMasterRowData = data?.map((item: any) => {
          const obj = {
            id: item?.heightId,
            heightName: item?.heightName,
          }
          return obj;
        });

      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Height List: ' + error?.statusText, AlertType.error);
      }
    })

  }
  getCastList(): any {
    this.castService.getCastList().subscribe({
      next: (data: any) => {
        if (data) {
          this.castMasterRowData = data.map((item: any) => {
            item['id'] = item?.castId;
            // item['hasSubCast'] = item?.hasSubcast;
            return item;
          });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Cast List: ' + error?.statusText, AlertType.error);
      }
    })

  }

  getHandycapList(): any {
    this.handycapService.getHandycapList().subscribe({
      next: (data: any) => {
        if (data) {
          this.handycapMasterRowData = data?.map((item: any) => {
            item['id'] = item?.handycapId;
            return item;
          });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Handyap List: ' + error?.statusText, AlertType.error);
      }
    })

  }
  getUserList(): any {
    this.userService.getUserList().subscribe({
      next: (data: any) => {
        if (data) {
          this.userMasterRowData = data?.map((item: any) => {
            item['id'] = item?.userId;
            return item;
          });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('User List: ' + error?.statusText, AlertType.error);
      }
    })
  }
}
