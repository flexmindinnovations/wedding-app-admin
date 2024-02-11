import { Component, OnInit, inject } from '@angular/core';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentPage: any;
  sidebarItemService = inject(SidebarItemsService);
  themeToggle = false;
  constructor() { }

  ngOnInit() {
    this.getCurrentPage();
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // console.log('>>>>> prefersDark : ', prefersDark);


    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    // this.initializeDarkTheme(prefersDark.matches);

    // // Listen for changes to the prefers-color-scheme media query
    // prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));
  }

  initializeDarkTheme(isDark: any) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(ev: any) {
    this.toggleDarkTheme(ev.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: any) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  getCurrentPage() {
    this.sidebarItemService.getCurrentPage().subscribe({
      next: (data: any) => {
        this.currentPage = data?.title;
      }
    })
  }

}
