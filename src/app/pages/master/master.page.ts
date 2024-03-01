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
import { EducationService } from 'src/app/services/education/education.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  educationService = inject(EducationService);
  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);
  alert = inject(AlertService);

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
  }

  setMasterData() {
    this.setHeightMasterGridData();
    this.setRoleMasterGridData();
    this.setEducationMasterGridData();
    this.setSpecializationMasterGridData();
  }

  setHeightMasterGridData() {

    this.heightMasterRowData = [
      { id: 1, title: "Height" }
    ];

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

  setEducationMasterGridData() {
    this.educationMasterColumnDefs = [
      { field: 'id', width: 60 },
      { field: 'educationName', width: 300 },
      { field: 'hasSpecialization', width: 155 },
      { field: 'specializationCount', width: 80 },
      {
        field: "action",
        colId: 'education',
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
        // let datum = data.map(e=>)
        if (data) {
          console.log('data: ', data);

          this.educationMasterRowData = data.map((item: any) => {
            item['id'] = item?.educationId;
            // item['specializationCount'] = this.
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
      { field: 'id', width: 60 },
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
      }
    } else {
     this.openDeleteConfirmationModal(event); 
    }
  }

  openDeleteConfirmationModal(data: any) {
    console.log('data: ', data);
    
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
      cssClass: 'height-modal'
    });
    console.log('>>>>> modal : ', modal);
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
  }

  async openAddEditEducationModal(event?: any) {
    this.canShowModal = true;
    let isEditMode = false;
    if (event?.src === GridActions.edit) {
      isEditMode = true;
    }
    const modal = await this.modalCtrl.create({
      component: AddEditEducationComponent,
      cssClass: 'education-modal',
      componentProps: {
        data: {
          title: isEditMode ? 'Edit: ' + event?.rowData?.educationName : 'Add New Course',
          data: { ...event, isEditMode }
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

}
