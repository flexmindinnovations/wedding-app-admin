import { AfterViewInit, Component, OnDestroy, OnInit, SimpleChange, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddEditUserComponent } from 'src/app/modals/add-edit-user/add-edit-user.component';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { SIDEBAR_ITEMS } from 'src/util/sidebar-items';
import { COLOR_SCHEME, dashboardCards } from 'src/util/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
  sharedService = inject(SharedService);
  sidebarService = inject(SidebarItemsService);
  router = inject(Router);
  colorScheme: any = COLOR_SCHEME;
  cssClass: any;
  dashboardItems: any[] = [];
  permissionList: any[] = [];
  profileDetails: any;
  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);

  canViewCustomers = false;
  canViewBranches = false;

  showProfile = false;

  constructor() { }

  ngOnInit() {
    this.setCssClasses();
    this.getDashboardItems();
  }

  ngAfterViewInit(): void {
    const jsonItems = SIDEBAR_ITEMS;
    this.profileDetails = JSON.parse(localStorage.getItem('profile') || '{}');
    const menuItemsMap = new Map<number, any>();
    const routes = ['Customers']
    this.sharedService.getUserPermissions().subscribe((permissionList) => {
      if (permissionList) {
        const dashboardItems = this.dashboardItems;
        const newList = permissionList.filter((item: any) => item.canView === true);
        newList.forEach((item: any) => {
          dashboardItems.forEach((el: any) => {
            if (el?.hasRoute) {
              el.hasRoute = false;
              el.isLink = false;
            }
            if (el?.label === item?.moduleName) {
              el.hasRoute = true;
              el.isLink = true;
            }
          })
        })
      }
    });

    this.sharedService.getLogoutEvent().subscribe((event: any) => {
      if (event) {
        this.profileDetails = undefined;
        this.permissionList = [];
        this.dashboardItems = [];
      }
    })

  }

  onProfileClicked() {
    const userId = localStorage.getItem('userId');
    this.sharedService.getUserByUserId(userId).subscribe({
      next: (data: any[]) => {
        if (data) {
          this.openAddEditUserModal(null, data);
        }
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  async openAddEditUserModal(event?: any, rowData?: any) {
    this.canShowModal = true;
    const allData = { ...event, rowData }
    const modal = await this.modalCtrl.create({
      component: AddEditUserComponent,
      cssClass: 'user-modal',
      componentProps: {
        data: {
          title: "Update Profile",
          data: { ...allData, isEditMode: true }
        }
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    const actionEvents = ['save', 'update'];
    const eventType = data?.data?.event;
    if (actionEvents.includes(eventType)) {
      // this.getHeightList();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

  setCssClasses(): void {
    this.cssClass = dashboardCards[this.colorScheme];
  }

  getDashboardItems(): void {
    this.sharedService.getDashboardItems().subscribe((items: any) => {
      this.dashboardItems = items;
      console.log('items', items)
      this.sharedService.getDashboardCountList().subscribe({
        next: (data: any[]) => {
          if (data) {
            this.dashboardItems = data?.map(item => {
              const obj = {
                count: item?.totalCount,
                title: `Total ${item?.type?.charAt(0).toUpperCase() + item?.type?.substr(1).toLowerCase()}`
              }
              return obj;

            })
          }
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })

    })

  }

  handleShowProfileStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.showProfile = value;
  }

  handleOnItemClick(item: any) {
    if (item?.hasRoute) {
      // this.router.navigateByUrl(item?.route);
      // this.sidebarService.setCurrentRoute(item?.route);
    }
  }

}
