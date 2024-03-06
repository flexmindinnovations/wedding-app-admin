import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { COLOR_SCHEME, dashboardCards } from 'src/util/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  sharedService = inject(SharedService);
  sidebarService = inject(SidebarItemsService);
  router = inject(Router);
  colorScheme: any = COLOR_SCHEME;
  cssClass: any;

  dashboardItems: any[] = [];

  constructor() { }

  ngOnInit() {
    this.setCssClasses();
    this.getDashboardItems();
  }

  setCssClasses(): void {
    this.cssClass = dashboardCards[this.colorScheme];
  }

  getDashboardItems(): void {
    this.sharedService.getDashboardItems().subscribe((items: any) => {
      this.dashboardItems = items;
    })
  }

  handleOnItemClick(item: any) {
    if (item?.hasRoute) {
      this.router.navigateByUrl(item?.route);
      this.sidebarService.setCurrentRoute(item?.route);
    }
  }

}
