import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSkeletonSidebarComponent } from './admin-skeleton-sidebar/admin-skeleton-sidebar.component';

const routes: Routes = [
  { path: 'qwe', component: AdminSkeletonSidebarComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSkeletonRoutingModule { }
