import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { GridButtonsComponent } from 'src/app/components/grid-buttons/grid-buttons.component';
import { GridActions } from 'src/app/enums/grid-actions';
import { BlogService } from 'src/app/services/blog/blog.service';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import * as moment from 'moment';
import { GridCellImageComponent } from 'src/app/components/grid-cell-image/grid-cell-image.component';
import { GridCellStatusComponent } from 'src/app/components/grid-cell-status/grid-cell-status.component';
import { RolesService } from 'src/app/services/role/roles.service';
import { ModalController } from '@ionic/angular';
import { DeleteConfirmComponent } from 'src/app/modals/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit, AfterViewInit {

  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  frameworkComponents: any;
  blogService = inject(BlogService);
  alertService = inject(AlertService);
  roleService = inject(RolesService);
  isAddActive: boolean = false;
  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);

  // Row Data: The data to be displayed.
  rowData: any[] = [];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: "id", headerName: "#id", width: 110 },
    {
      field: "blogImagePath",
      headerName: 'Image',
      wrapText: true,
      autoHeaderHeight: true,
      width: 120,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridCellImageComponent,
      } as IGroupCellRendererParams
    },
    { field: "title", width: 450 },
    { field: "blogDate", width: 250 },
    {
      field: "isActive",
      width: 110,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridCellStatusComponent,
      } as IGroupCellRendererParams
    },

    {
      field: "action",
      width: 120,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: GridButtonsComponent,
        onClick: this.handleGridActionButtonClick.bind(this)
      } as IGroupCellRendererParams
    },
  ];

  constructor() {
    this.frameworkComponents = {
      buttonRenderer: GridButtonsComponent
    }
  }

  ngOnInit() {
    this.getBlogList();
    this.getPermissionListByRoleId();
  }

  ngAfterViewInit(): void {
    this.blogService.getRequestStatus().subscribe(isCompleted => {
      if (isCompleted) this.getBlogList();
    })
  }

  getPermissionListByRoleId() {
    const roleId = localStorage.getItem('role');
    this.roleService.getPermissionListById(roleId).subscribe({
      next: (permissionList: any) => {
        if (permissionList) {
          const newList = permissionList?.filter((item: any) => item?.moduleName === 'Blogs')[0];
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


  getBlogList(): void {
    this.blogService.getBlogList().subscribe({
      next: (data: any) => {
        if (data) {
          this.rowData = data?.map((blog: any) => {
            return {
              id: blog?.blogId,
              title: blog?.blogTitle,
              blogImagePath: blog?.blogImagePath,
              isActive: blog?.isActive,
              blogDate: moment(blog?.blogDate).format("DD/MM/YYYY")
            }
          })
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  handleClick() {
    this.sidebarItemService.setCurrentPage('Add New Blog Page')
    this.router.navigateByUrl('blog/add', { state: { route: 'add', pageName: 'Add Blog', title: 'Add Blog' } });
  }

  handleGridActionButtonClick(event: any) {
    const action = event?.src;
    const data = event?.rowData;
    if (action === GridActions.edit) {
      this.router.navigateByUrl(`blog/edit/${data?.id}`, { state: { route: 'edit', pageName: 'Edit Blog', title: 'Edit Blog' } })
    } else {
      this.openDeleteModal(data);
    }
  }
  async openDeleteModal(event?: any) {
    console.log('open')
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
      const blogId = event?.id;
      this.blogService.deleteBlog(blogId).subscribe({
        next: (data: any) => {
          if (data) {
            this.alertService.setAlertMessage(data?.message, AlertType.error);
            this.getBlogList();
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
