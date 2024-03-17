import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { SidebarItemsService } from './services/sidebar-items.service';
import { COLOR_SCHEME } from 'src/util/util';
import { Spinkit } from 'ng-http-loader';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  isCollapsed: boolean = false;
  selectedTheme = 'dark';
  router = inject(Router);
  titleCasePipe = inject(TitleCasePipe);
  sidebarItemService = inject(SidebarItemsService);
  public spinkit = Spinkit; 
  loaderTheme = (COLOR_SCHEME as 'br') ? '#1e9aff' : (COLOR_SCHEME as 'bo') ? '#ff7f0a' : '#3d51e6';

  menuClassess = {
    collapsed: `delay-150 duration-300 ease-out md:!w-[8%] lg:!w-[5%] md:max-w-[25%] lg:max-w-[25%]`,
    expanded: `delay-150 duration-300 ease-out md:w-[20%] lg:w-[15%] md:max-w-[25%] lg:max-w-[25%]`
  }

  constructor() { }

  ngOnInit(): void {
    localStorage.setItem('color-scheme', COLOR_SCHEME);
  }

  ngAfterViewInit(): void {
    initFlowbite();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          const url = event.url;
          const activeRoute = url.substring(url.lastIndexOf('/') + 1, url.length);
          console.log('activeRoute: ', activeRoute);
          
          this.sidebarItemService.setCurrentPage(this.titleCasePipe.transform(activeRoute));
        }
      }
    })
  }

  handleIsCollapsed(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
  }
}
