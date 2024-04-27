import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { SideBarItem } from 'src/app/interfaces/sidebar';
import { AlertService } from 'src/app/services/alert/alert.service';
import { RolesService } from 'src/app/services/role/roles.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { ThemeService } from 'src/app/services/theme.service';
import { SIDEBAR_ITEMS } from 'src/util/sidebar-items';
import { COLOR_SCHEME, nestedRoutes, themeVariables } from 'src/util/util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);
  sharedService = inject(SharedService);
  roleService = inject(RolesService);
  alert = inject(AlertService);
  themeService = inject(ThemeService);
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
  logoSrc: any = '/assets/icon/logo.png';
  activeRoute: any;

  ngOnInit() {
    const jsonItems = SIDEBAR_ITEMS;
    this.sidebarItems = jsonItems;
    const menuItemsMap = new Map<number, any>();
    this.sharedService.getUserPermissions().subscribe((permissionList) => {
      if (permissionList) {
        const newList = permissionList.filter((item: any) => item.canView === true);
        let permissionsArray = newList;
        for (let i = 0; i < permissionsArray.length; i++) {
          if (permissionsArray[i].moduleName === "MasterData") {
            permissionsArray[i].moduleName = "Master Data";
            break;
          }
        }
        this.sharedService.permissionListMap.set('permissionList', permissionList);
        this.showTitles = this.isSidebarExpanded ? true : false;
        permissionsArray.forEach((item: any) => {
          jsonItems.forEach((menu: any) => {
            if (menu.title.toLowerCase() === item.moduleName.toLowerCase()) {
              menuItemsMap.set(item.moduleId, {
                id: item?.moduleId,
                title: item?.moduleName,
                route: menu?.route,
                isActive: false,
                icon: menu?.icon
              })
            }
          })
        });
        const menuItemsMapValues = Array.from(menuItemsMap.values());
        this.sidebarItems = [jsonItems[0], ...menuItemsMapValues];
        this.sidebarItemService.getCurrentRoute().subscribe((route: string) => {
          this.sidebarItems.forEach(each => each.isActive = false);
          if (route) this.setActiveItem(route);
          else this.sidebarItems[0].isActive = true;
        })
      }
    })
  }

  ngAfterViewInit(): void {
    this.sharedService.getLogoutEvent().subscribe((event: any) => {
      if (event) {
        this.sidebarItems = [];
      }
    })

    this.router.events.subscribe((events: any) => {
      if (events instanceof NavigationEnd) {        
        const activeUrl = events?.url;
        this.activeRoute = activeUrl;
        this.setParentRoute(activeUrl);
      }
    })

    this.themeService.getThemeToggle().subscribe((theme: string) => {
      this.logoSrc = theme === 'light' ? '/assets/icon/logo.png' : '/assets/icon/logo_white.png';
    })
  }

  setParentRoute(currentRoute: any) {
    const routeSplitted = currentRoute.split('/');
    const isNestedRoute = nestedRoutes.includes(routeSplitted[1] && routeSplitted.length > 2);
    let activeRoute: any;
    if (isNestedRoute) activeRoute = currentRoute.split('/')[1];
    else activeRoute = currentRoute.substring(currentRoute.lastIndexOf('/') + 1, currentRoute.length);
    if (this.sidebarItems.length) {
      this.sidebarItems.forEach(each => each.isActive = false);
      if (activeRoute) this.setActiveItem(activeRoute);
      else this.sidebarItems[0].isActive = true;
    }
    this.getPermissionListByRoleId();
  }

  handleSidebarItemClick(item: SideBarItem) {
    this.router.navigateByUrl(item.route, { state: item });
  }

  setActiveItem(param: any) {
    const isId = typeof (param) === 'number';
    if (!isId && param.includes('/')) param = param.split('/')[1];
    this.sidebarItems.forEach(each => each.isActive = false);
    const cItemIndex = this.sidebarItems.findIndex(each => isId ? (each.id === param) : (each.route === param));
    if (cItemIndex > -1) {
      this.sidebarItems[cItemIndex].isActive = true;
      this.sidebarItemService.setCurrentPage(this.sidebarItems[cItemIndex]);
    } else {
      this.sidebarItems[0].isActive = true;
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

  getPermissionListByRoleId() {
    // debugger;
    const roleId = localStorage.getItem('role');
    const jsonItems = SIDEBAR_ITEMS;
    this.sidebarItems = jsonItems;
    const menuItemsMap = new Map<number, any>();
    this.roleService.getPermissionListById(roleId).subscribe({
      next: (permissionList: any) => {
        if (permissionList) {
          const newList = permissionList.filter((item: any) => item.canView === true);
          let permissionsArray = newList;
          for (let i = 0; i < permissionsArray.length; i++) {
            if (permissionsArray[i].moduleName === "MasterData") {
              permissionsArray[i].moduleName = "Master Data";
              break;
            }
          }
          this.sharedService.permissionListMap.set('permissionList', permissionList);
          this.showTitles = this.isSidebarExpanded ? true : false;
          permissionsArray.forEach((item: any) => {
            jsonItems.forEach((menu: any) => {
              if (menu.title.toLowerCase() === item.moduleName.toLowerCase()) {
                menuItemsMap.set(item.moduleId, {
                  id: item?.moduleId,
                  title: item?.moduleName,
                  route: menu?.route,
                  isActive: false,
                  icon: menu?.icon
                })
              }
            })
          });
          const menuItemsMapValues = Array.from(menuItemsMap.values());
          this.sidebarItems = [jsonItems[0], ...menuItemsMapValues];
          this.setActiveItem(this.activeRoute);
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  getStyleClasses() {
    this.colorScheme = localStorage.getItem('color-scheme') || this.colorScheme;
    const activeClass = `active-${this.colorScheme}`;
    return activeClass;
  }

  ngOnDestroy(): void {
    this.sidebarItems = [];
  }
}
