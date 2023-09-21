import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor() { }

  success() {
    Swal.fire({
      html:
        '<span style="float: left; padding-top: 8px; font-weight: 500">Added Succesfully</span> <img style="float: right;padding-top: 10px" src="../assets/icons/cross.png">', position: 'bottom', timer: 4000, showCancelButton: false, width: 400, showConfirmButton: false, background: "#E8FFF3", color: "#47BE7D", backdrop: false
    })
  }

  delete() {
    Swal.fire({
      html:
        '<span style="float: left; padding-top: 8px; font-weight: 500">Delete Succesfully</span> <img style="float: right;padding-top: 10px" src="../assets/icons/cross.png">', position: 'bottom', timer: 4000, showCancelButton: false, width: 400, showConfirmButton: false, background: "#E8FFF3", color: "#47BE7D", backdrop: false
    })
  }

  error() {
    Swal.fire({
      html:
        '<span style="float: left; padding-top: 10px; font-weight: 500">Something went wrong</span> <i class="bi bi-exclamation" style="font-size: 32px"></i>', position: 'bottom', timer: 4000, showCancelButton: false, width: 400, showConfirmButton: false, background: "#FF4433", color: "#fff", backdrop: false
    })
  }

  login() {
    Swal.fire({
      html:
        '<span style="float: left; padding-top: 8px; font-weight: 500">Login Succesfully</span> <img style="float: right;padding-top: 10px" src="../assets/icons/cross.png">', position: 'bottom', timer: 4000, showCancelButton: false, width: 400, showConfirmButton: false, background: "#E8FFF3", color: "#47BE7D", backdrop: false
    })
  }
  
}
