import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 isCollapsed = false;
  isMobile = window.innerWidth < 992;
  sidebarOpen = false;

  toggleSidebar() {
    if (this.isMobile) {
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
