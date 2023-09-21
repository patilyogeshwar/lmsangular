import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginClass } from '../models/models';
import { HttpServiceService } from '../services/http-service.service';
import { Router } from '@angular/router';
import { AlertServiceService } from '../services/alert-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  submitted: boolean = false;
  loginModel!: LoginClass;
  @Output() loginEvent = new EventEmitter<boolean>();
  
  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService) { }

  ngOnInit() {
    this.initializeSaveFormValidations();
  }

  initializeSaveFormValidations() {
    this.loginForm = this.fb.group({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
  }

  get f() { return this.loginForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.login();
  }

  login() {
    this.loginModel = this.loginForm.value;
    this.httpService.post('auth/login', this.loginModel).subscribe((data: any) => {
      if (data) {
        if (data.user) {
          sessionStorage.setItem('userProfile', JSON.stringify(data.user))
        }
        if (data.tokens) {
          sessionStorage.setItem('tokens', JSON.stringify(data.tokens))
        }
        this.alertServiceService.login();
        this.loginEvent.emit(true);
      }
    })
  }
}
