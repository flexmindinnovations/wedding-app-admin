import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
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
      if(event) {
        this.profileDetails = undefined;
        this.permissionList = [];
        this.dashboardItems = [];
      }
    })
  }

  setCssClasses(): void {
    this.cssClass = dashboardCards[this.colorScheme];
  }

  getDashboardItems(): void {
    this.sharedService.getDashboardItems().subscribe((items: any) => {
      this.dashboardItems = items;
      const permissionListMap = this.sharedService.permissionListMap.get('permissionList');
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
