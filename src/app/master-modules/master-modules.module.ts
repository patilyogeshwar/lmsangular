import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectMasterComponent } from './subject-master/subject-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterModulesRoutingModule } from './master-modules-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ClassMasterComponent } from './class-master/class-master.component'
import { BoardMasterComponent } from './board-master/board-master.component';
import { ChapterMasterComponent } from './chapter-master/chapter-master.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BoardcastComponent } from './boardcast/boardcast.component';
import { BookMasterComponent } from './book-master/book-master.component';
import { MediumMasterComponent } from './medium-master/medium-master.component';
import { SearchPipe } from '../pipes/search.pipe';
import { LessonMasterComponent } from './lesson-master/lesson-master.component';
import { PlanMasterComponent } from './plan-master/plan-master.component';
import { VideoMasterComponent } from './video-master/video-master.component';


@NgModule({
  declarations: [
    BoardMasterComponent,
    ChapterMasterComponent,
    SubjectMasterComponent,
    ClassMasterComponent,
    SearchPipe,
    BoardMasterComponent,   
    PlanMasterComponent,  
    VideoMasterComponent,  
    ChapterMasterComponent,
    BoardcastComponent,    
    BookMasterComponent,
    MediumMasterComponent,
    LessonMasterComponent
  ],
  imports: [
    CommonModule,

    ReactiveFormsModule,
    MasterModulesRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class MasterModulesModule { }
