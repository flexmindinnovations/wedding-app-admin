import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { ModalController } from '@ionic/angular';
import { AddEditHeightComponent } from 'src/app/modals/add-edit-height/add-edit-height.component';

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

  rowData = [
    { id: 1, title: "Height" }
  ];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: "id", width: 60 },
    { field: "title" },
    {
      field: "action",
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridButtonsComponent,
        onClick: this.handleGridActionButtonClick.bind(this)
      } as IGroupCellRendererParams
    },
  ];

  ngOnInit() {
  }

  async handleClick(event: any) {
    const modal = await this.modalCtrl.create({
      component: AddEditHeightComponent,
      cssClass: 'search-modal'
    });
    console.log('>>>>> modal : ', modal);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
  }

  async handleGridActionButtonClick(event: any) {
    if (event.src === GridActions.edit) {
      this.canShowModal = true;
      const modal = await this.modalCtrl.create({
        component: AddEditHeightComponent,
        cssClass: 'add-edit-master-modal'
      });
      console.log('>>>>> modal : ', modal);
      modal.present();

      const { data, role } = await modal.onWillDismiss();
      console.log('data: ', data);
      console.log('role: ', role);
    }
  }


  ngOnDestroy(): void { }

}
