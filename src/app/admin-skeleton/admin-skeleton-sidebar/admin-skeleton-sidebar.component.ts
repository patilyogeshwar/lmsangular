import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-skeleton-sidebar',
  templateUrl: './admin-skeleton-sidebar.component.html',
  styleUrls: ['./admin-skeleton-sidebar.component.css']
})
export class AdminSkeletonSidebarComponent {

  toggleButton: boolean | undefined;

  toggleSwitch() {
    this.toggleButton = this.toggleButton ? false : true;
  }

}
