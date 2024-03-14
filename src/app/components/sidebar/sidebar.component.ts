import { AfterViewInit, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarItem } from 'src/app/interfaces/sidebar';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { SIDEBAR_ITEMS } from 'src/util/sidebar-items';
import { COLOR_SCHEME, nestedRoutes, themeVariables } from 'src/util/util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  sharedService = inject(SharedService);
  sidebarItems: SideBarItem[] = [];
  buttonHelp = 'Collapse Sidebar';
  isSidebarExpanded = true;
  sidebarToggleIcon = 'back';
  sidebarHeaderText = 'Wedding App';
  showTitles = true;
  @Output() isCollapsed = new EventEmitter();
  // colorScheme = 'red';
  colorScheme: any = COLOR_SCHEME;
  cssClass: any;

  ngOnInit() {
    this.colorScheme = localStorage.getItem('color-scheme') || this.colorScheme;
    this.cssClass = themeVariables[this.colorScheme];
    const jsonItems = SIDEBAR_ITEMS;
    const menuItems: any[] = [
      jsonItems[0]
    ];
    this.sidebarItems = jsonItems;
    // this.sharedService.getUserPermissions().subscribe((permissionList) => {
    //   if (permissionList) {
    //     this.sharedService.permissionListMap.set('permissionList', permissionList);
    //     this.showTitles = this.isSidebarExpanded ? true : false;
    //     permissionList.forEach((item: any) => {
    //       jsonItems.forEach((menu: any) => {
    //         if (menu.title === item?.moduleName) {
    //           const menuItem = {
    //             "id": item?.permissionId,
    //             "title": item?.moduleName,
    //             "route": menu?.route,
    //             "isActive": false,
    //             "icon": menu?.icon
    //           }
    //           menuItems.push(menuItem);
    //         }
    //       })
    //     });
    //     this.sidebarItems = menuItems;
    //   } else {
    //     console.log('permissionList else: ', permissionList);
    //   }
    // })
    
  }

  ngAfterViewInit(): void {
    this.getSidebarItems();
    this.sidebarItemService.getCurrentRoute().subscribe((route: string) => {
      this.sidebarItems.forEach(each => each.isActive = false);
      if (route) this.setActiveItem(route);
      else this.sidebarItems[0].isActive = true;
    })
  }


  getSidebarItems() {
    const route = window.location.pathname;
    const routeSplitted = route.split('/');
    const isNestedRoute = nestedRoutes.includes(routeSplitted[1]);
    if (isNestedRoute) {
      const activeRoute = route.split('/');
      if (activeRoute.length) this.setActiveItem(activeRoute[1]);
      else {
        this.sidebarItems[0].isActive = true;
        this.sidebarItemService.setCurrentPage(this.sidebarItems[0]);
      }
    } else {
      const activeRoute = route.substring(route.lastIndexOf('/') + 1, window.location.href.length);
      if (activeRoute) this.setActiveItem(activeRoute);
      else {
        this.sidebarItems[0].isActive = true;
        this.sidebarItemService.setCurrentPage(this.sidebarItems[0]);
      }
    }
  }

  handleSidebarItemClick(item: SideBarItem) {
    this.setActiveItem(item.route);
    this.router.navigateByUrl(item.route);
  }

  setActiveItem(param: number | string) {
    const isId = typeof (param) === 'number';
    this.sidebarItems.forEach(each => each.isActive = false);
    const cItemIndex = this.sidebarItems.findIndex(each => isId ? (each.id === param) : (each.route === param));
    if (cItemIndex > -1) {
      this.sidebarItems[cItemIndex].isActive = true;
      this.sidebarItemService.setCurrentPage(this.sidebarItems[cItemIndex]);
    }
  }

  handleSidebarToggle() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
    this.showTitles = false;
    this.sidebarHeaderText = '';
    this.buttonHelp = this.isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar';
    this.toggleClasses();
    this.isCollapsed.emit(!this.isSidebarExpanded);
  }

  toggleClasses() {
    setTimeout(() => {
      this.sidebarHeaderText = this.isSidebarExpanded ? 'Wedding App' : '';
      this.showTitles = !!this.isSidebarExpanded;
      this.sidebarToggleIcon = this.isSidebarExpanded ? 'back' : 'forward';
    }, 400)
  }
}
