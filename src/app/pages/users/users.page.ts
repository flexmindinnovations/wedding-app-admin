import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  router = inject(Router);
  sidebarItemService = inject(SidebarItemsService);

  ngOnInit() {
  }

  handleClick() {
    this.sidebarItemService.setCurrentPage('Add User');
    this.router.navigateByUrl('users/add');
  }

}
