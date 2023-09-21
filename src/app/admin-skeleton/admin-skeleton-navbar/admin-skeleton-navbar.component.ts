import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-skeleton-navbar',
  templateUrl: './admin-skeleton-navbar.component.html',
  styleUrls: ['./admin-skeleton-navbar.component.css']
})
export class AdminSkeletonNavbarComponent {

  toggleButton: boolean = false;

  @Output()
  message: EventEmitter<boolean> = new EventEmitter();

  toggleSwitch() {
     this.toggleButton = this.toggleButton ? false : true;
     this.message.emit(this.toggleButton);
  }
  
}
