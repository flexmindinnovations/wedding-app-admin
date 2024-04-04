import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { GridActions } from 'src/app/enums/grid-actions';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event/event.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';
import * as moment from 'moment';
import { GridCellStatusComponent } from 'src/app/components/grid-cell-status/grid-cell-status.component';
import { GridCellImageComponent } from 'src/app/components/grid-cell-image/grid-cell-image.component';
import { RolesService } from 'src/app/services/role/roles.service';
import { DeleteConfirmComponent } from 'src/app/modals/delete-confirm/delete-confirm.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, AfterViewInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  eventService = inject(EventService);
  alert = inject(AlertService);
  rowData: any[] = [];
  roleService = inject(RolesService);
  alertService = inject(AlertService);
  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);
  isAddActive: boolean = false;
  colDefs: ColDef[] = [
    { field: "eventId", headerName: "#id", width: 100 },
    {
      field: "eventImagePath",
      headerName: 'Image',
      wrapText: true,
      autoHeaderHeight: true,
      width: 100,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridCellImageComponent,
      } as IGroupCellRendererParams
    },
    { field: "eventName", width: 400 },
    { field: "eventDate" },
    { field: "eventLocation", width: 250 },
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
      width: 120,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridButtonsComponent,
        onClick: this.handleGridActionButtonClick.bind(this)
      } as IGroupCellRendererParams
    },
  ];

  ngOnInit() {
    this.getEventList();
  }
  getPermissionListByRoleId() {
    const roleId = localStorage.getItem('role');
    this.roleService.getPermissionListById(roleId).subscribe({
      next: (permissionList: any) => {
        if (permissionList) {
          const newList = permissionList?.filter((item: any) => item?.moduleName === 'Events')[0];
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


  ngAfterViewInit(): void {
    this.eventService.getRequestStatus().subscribe(isCompleted => {
      if (isCompleted) this.getEventList();
    })

  }

  getEventList() {
    this.eventService.getEventList().subscribe({
      next: (data: any) => {
        if (data) {
          this.rowData = data?.map((event: any) => {
            return {
              eventId: event?.eventId,
              eventName: event?.eventName,
              eventImagePath: event?.eventImagePath,
              eventLocation: event?.location,
              isActive: event?.isActive,
              eventDate: moment(event?.eventDate).format("DD/MM/YYYY")
            }
          })
          this.getPermissionListByRoleId();
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  handleClick() {
    this.sidebarItemService.setCurrentPage('Add Event');
    this.router.navigateByUrl('events/add', { state: { route: 'add', pageName: 'Add Event', title: 'Add Event' } });
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    if (action === GridActions.edit) {
      this.sidebarItemService.setCurrentPage('Edit Event');
      this.router.navigateByUrl(`events/edit/${data?.eventId}`, { state: { route: 'edit', pageName: 'Edit Event', title: 'Edit Event' } })
    } else {
      // console.log('>>>>> event delete: ', event);
      this.openDeleteEvents(data);
    }
  }
  async openDeleteEvents(event?: any) {
    this.canShowModal = true;
    const modal = await this.modalCtrl.create({
      component: DeleteConfirmComponent,
      componentProps: {
        data: {
          title: 'Are you sure you want to Delete?',
          data: { ...event }
        }
      },
      cssClass: 'delete-modal'
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['delete'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      const eventId = event?.eventId;
      this.eventService.deleteEvent(eventId).subscribe({
        next: (data: any) => {
          if (data) {
            this.alertService.setAlertMessage(data?.message, AlertType.error);
            this.getEventList();
          }
        },
        error: (error) => {
          console.log('error: ', error);
          this.alertService.setAlertMessage(error?.message, AlertType.error);
        }
      })

    }
  }


}
