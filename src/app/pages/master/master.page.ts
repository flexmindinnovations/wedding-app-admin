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

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);
  heightService = inject(HeightService);

  heightMasterRowData: any = [];
  heightMasterColumnDefs: ColDef[] = [];

  roleMasterRowData: any = [];
  roleMasterColumnDefs: ColDef[] = [];

  educationMasterRowData: any = [];
  educationMasterColumnDefs: ColDef[] = [];

  specializationMasterRowData: any = [];
  specializationMasterColumnDefs: ColDef[] = [];

  ngOnInit() {
    this.setMasterData();
    this.getBranchList();
  }

  setMasterData() {
    this.setHeightMasterGridData();
    this.setRoleMasterGridData();
  }

  setHeightMasterGridData() {

    this.heightMasterRowData = [];

    this.heightMasterColumnDefs = [
      { field: "id", width: 60 },
      { field: "title", minWidth: 435 },
      {
        field: "action",
        colId: 'height',
        width: 100,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];
  }

  setRoleMasterGridData() {
    this.roleMasterColumnDefs = [
      { field: 'id', width: 60 },
      { field: 'roleName', width: 150 },
      { field: 'roleAccess', width: 285 },
      {
        field: "action",
        colId: 'role',
        width: 100,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: GridButtonsComponent,
          onClick: this.handleGridActionButtonClick.bind(this)
        } as IGroupCellRendererParams
      },
    ];

    this.roleMasterRowData = [
      { id: 1, roleName: "Super Admin", roleAccess: 'All Permissions' }
    ];
  }

  setEducationMasterGridData() { }
  setSpecializationMasterGridData() { }

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
    }
  }

  async handleGridActionButtonClick(event: any) {
    console.log('event: ', event);
    const modelType = event?.gridId?.toLowerCase();
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
    }
  }

  ngOnDestroy(): void { }


  /** Modals handling */

  async openAddEditRoleModal(event?: any) {
    this.canShowModal = true;

    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    const modal = await this.modalCtrl.create({
      component: AddEditRoleComponent,
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: ' + event?.rowData.roleName : 'Add New Role',
          data: event
        }
      },
      cssClass: 'roles-modal'
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    // console.log('data: ', data);
    // console.log('role: ', role);
  }

  async openAddEditHeightModal(event?: any) {
    console.log('data: ', event);
    this.canShowModal = true;

    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    console.log('isEditMode: ', isEditMode);

    const modal = await this.modalCtrl.create({
      component: AddEditHeightComponent,
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: ' + event?.rowData.heightName : 'Add New Height',
          data: event
        }
      },
      cssClass: 'height-modal'
    });
    console.log('>>>>> modal : ', modal);
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
  }

  async openAddEditEducationModal(event?: any) {
    console.log('data: ', event);
    this.canShowModal = true;

    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    console.log('isEditMode: ', isEditMode);

    const modal = await this.modalCtrl.create({
      component: AddEditEducationComponent,
      cssClass: 'education-modal',
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: ' + event?.rowData.roleName : 'Add New Course',
          data: event
        }
      }
    });
    console.log('>>>>> modal : ', modal);
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
  }

  getBranchList(): any {
    this.heightService.getHeightList().subscribe({
      next: (data: any[]) => {
        this.heightMasterRowData = data?.map((item: any) => {
          const obj = {
            id: item?.heightId,
            title: item?.heightName
          }
          return obj;
        });

      },
      error: (error) => {
        console.log('error: ', error);

      }
    })

  }
}
