import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
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

  @Output() showMobileMenu = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.getCurrentPage();
  }

  getCurrentPage() {
    this.sidebarItemService.getCurrentPage().subscribe({
      next: (data: any) => {
        this.currentPage = data?.title;
      }
    })
  }

  handleMobileMenuClick() {
    this.showMobileMenu.emit(true);
  }
}
