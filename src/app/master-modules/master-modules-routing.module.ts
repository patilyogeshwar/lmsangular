import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectMasterComponent } from './subject-master/subject-master.component';
import { ClassMasterComponent } from './class-master/class-master.component';
import { BoardMasterComponent } from './board-master/board-master.component';
import { ChapterMasterComponent } from './chapter-master/chapter-master.component';
import { BoardcastComponent } from './boardcast/boardcast.component'
import { BookMasterComponent } from './book-master/book-master.component';
import { MediumMasterComponent } from './medium-master/medium-master.component';
import { LessonMasterComponent } from './lesson-master/lesson-master.component';
import { PlanMasterComponent } from './plan-master/plan-master.component';
import { VideoMasterComponent } from './video-master/video-master.component';
 

const routes: Routes = [
  { path: 'subject-master', component: SubjectMasterComponent },
  { path: 'class-master', component: ClassMasterComponent },
  { path: 'board', component: BoardMasterComponent },
  { path: 'chapter', component: ChapterMasterComponent },
  { path: 'boardcast', component: BoardcastComponent },
  { path: 'book-master', component: BookMasterComponent },
  { path: 'medium-master', component: MediumMasterComponent },
  { path: 'lesson-master', component: LessonMasterComponent },
  { path: 'plan', component: PlanMasterComponent },
  { path: 'studio', component: VideoMasterComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterModulesRoutingModule { }
