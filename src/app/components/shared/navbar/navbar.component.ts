import { ADMIN_ITEMS, DROPDOWN_CONFIG_ITEMS, DROPDOWN_ITEMS, NAV_ITEMS } from './navbar.content';
import { StorageService } from '../../../services/storage.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  navItems = NAV_ITEMS;
  dropdownItems = DROPDOWN_ITEMS;
  dropdownConfigItems = DROPDOWN_CONFIG_ITEMS;
  adminItems = ADMIN_ITEMS;

  storageService = inject(StorageService);
  router = inject(Router);

  get isLoggedIn(): boolean { return this.storageService.isLoggedIn();}

  get isAdmin(): boolean { return this.storageService.isAdmin(); }

  isAdminRoute(): boolean { return this.isAdmin && this.adminItems.some(item => this.router.url.startsWith(item.link)); }

  logout(): void { this.storageService.logout(); }
}
