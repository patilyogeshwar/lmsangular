import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminSkeletonSidebarComponent } from './admin-skeleton/admin-skeleton-sidebar/admin-skeleton-sidebar.component';
import { AdminSkeletonNavbarComponent } from './admin-skeleton/admin-skeleton-navbar/admin-skeleton-navbar.component';
import { AdminSkeletonBodyComponent } from './admin-skeleton/admin-skeleton-body/admin-skeleton-body.component';
import { AdminSkeletonModule } from './admin-skeleton/admin-skeleton.module';
import { MasterModulesModule } from './master-modules/master-modules.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminSkeletonSidebarComponent,
    AdminSkeletonNavbarComponent,
    AdminSkeletonBodyComponent,
    LoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AdminSkeletonModule,
    MasterModulesModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
