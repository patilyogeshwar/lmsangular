import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LessonMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-lesson-master',
  templateUrl: './lesson-master.component.html',
  styleUrls: ['./lesson-master.component.css']
})
export class LessonMasterComponent {

  lessonForm!: FormGroup;
  lessonArray!: FormArray;
  lessonMasterModel!: LessonMasterClass;
  searchBox!: string;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

  submitted = false;
  BoardsList!: any[];
  getAllData!: any[];
  allClasses!: any[];
  allMediums!: any[];
  allChapters!: any[];
  allBoards!: any[];
  allSubjects!: any[];
  allbooks!: any[];
  allLessons!: any[];
  MediumList!: any[];
  SubjectList!: any[];
  ClassList!: any[];
  BooksList!: any[];
  ChapterList!: any[];
  formType: string = "Save";

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.lessonForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    this.getAllSubjects();
    this.getAllBooks();
    this.getAllChapter();
    this.getAllLessons();
    this.lessonArray = this.lessonForm.get('lessonArray') as FormArray;
  }

  initializeValidations() {
    this.lessonForm = new FormGroup({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, Validators.required),
      classId: new FormControl(null, Validators.required),
      subjectId: new FormControl(null, Validators.required),
      bookId: new FormControl(null, Validators.required),
      chapterId: new FormControl(null, Validators.required),
      order: new FormControl(2),
      lessonArray: this.fb.array([this.createItem()]),
      id: new FormControl(''),
      type: new FormControl('https://www.youtube.com/watch?v=D52_BL9sVMU', Validators.required),
      thumbnail: new FormControl('https://ionicframework.com/docs/img/demos/thumbnail.svg', Validators.required),
      poster: new FormControl('https://ionicframework.com/docs/img/demos', Validators.required)
    });
  };


  createItem(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]]
    });
  }

  addlesson() {
    this.lessonArray = this.lessonForm.get('lessonArray') as FormArray;
    this.lessonArray.push(this.createItem());
  }

  removeSubject(data: any) {
    this.lessonArray.controls.forEach((item, i) => {
      if (item.value.name == data.value.name) {
        this.lessonArray.removeAt(i)
      }
    })
  }

  getAllBoards() {
    this.httpService.get('boards?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    })
  }

  getAllMedium() {
    this.httpService.get('medium?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMediums = data.results;
      }
    })
  }

  getAllClasses() {
    this.httpService.get('classes?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasses = data.results;
      }
    })
  }

  getAllSubjects() {
    this.httpService.get('subjects?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allSubjects = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getAllBooks() {
    this.httpService.get('books?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allbooks = data.results;
      }
    })
  }

  getAllChapter() {
    this.httpService.get('chapter?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allChapters = data.results;
      }
    })
  }

  getAllLessons() {
    this.httpService.get('lession?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allLessons = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      }
    })
  }

  cancel() {
    this.submitted = false;
    this.formType = "Save";
    this.lessonForm.reset();
    this.lessonArray.clear();
    this.addlesson();
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllLessons();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.getAllLessons();
    }
  }

  submitForm() {
    this.submitted = true;
    if (this.lessonForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveLesson();
    } else if (this.formType == "Update") {
      this.updateLesson();
    }
  }

  saveLesson() {
    this.lessonMasterModel = this.lessonForm.value;
    let lessonModelArray: any = JSON.parse(JSON.stringify(this.lessonMasterModel));
    for (let i = 0; i < lessonModelArray.lessonArray.length; i++) {
      this.lessonMasterModel.name = lessonModelArray.lessonArray[i].name;
      delete this.lessonMasterModel.lessonArray;
      delete this.lessonMasterModel.id;
      this.httpService.post('lession', this.lessonMasterModel).subscribe((data: any) => {
        this.alertServiceService.success();
        this.getAllBoards();
        this.getAllSubjects();
        this.getAllLessons();
        this.lessonForm.reset();
        this.submitted = false;
        this.lessonArray.clear();
        this.addlesson();
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  }

  updateLesson() {
    this.lessonMasterModel = this.lessonForm.value;
    let lessonModelArray: any = JSON.parse(JSON.stringify(this.lessonMasterModel));
    this.lessonMasterModel.name = lessonModelArray.lessonArray[0].name;
    delete this.lessonMasterModel.lessonArray;
    console.log(this.lessonMasterModel);
    this.httpService.patch('lession',this.lessonMasterModel).subscribe((res:any)=>{
      console.log(res);
      this.formType = "Save";
      this.getAllLessons();
      this.lessonArray.clear();
      this.cancel();
      this.alertServiceService.success();
    },(error)=>{
      this.alertServiceService.error();
    });
  }

  removelesson(data: any) {
    this.lessonArray.controls.forEach((item, i) => {
      if (item.value.name == data.value.name) {
        this.lessonArray.removeAt(i)
      }
    })
  }

  getMediumByBoardId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.boardId;
      this.httpService.getById('medium/getAllmedium', id).subscribe((data: any) => {
        this.allMediums = data;
        if (showForUpdate) {
          this.getClassByMediumId(event, true)
        }
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  }

  getClassByMediumId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.mediumId;
      this.httpService.getById('classes/getAllclassByMediumId', id).subscribe((data: any) => {
        this.allClasses = data;
        if (showForUpdate) {
          this.getSubjectByClassId(event, true)
        }
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  }

  getSubjectByClassId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.classId;
      this.httpService.getById('subjects/class', id).subscribe((data: any) => {
        this.allSubjects = data;
        if (showForUpdate) {
          this.getBookBySubjectId(event, true)
        }
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  };

  getBookBySubjectId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.allbooks = data;
        if (showForUpdate) {
          this.getChapterByBookId(event)
        }
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  };

  getChapterByBookId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.bookId;
      this.httpService.getById('chapter/getChaptersByBookid', id).subscribe((data: any) => {
        this.allChapters = data;
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  };

  getlessonByChpaterId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      this.httpService.getById('lession', id).subscribe((data: any) => {
        this.allLessons = data;
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  }

  getLessonById(id: any) {
    this.httpService.get('lession/' + id).subscribe((data: any) => {
      if (data) {
        this.lessonArray.clear();
        this.lessonArray.push(this.fb.group(data));
        this.lessonForm.patchValue({
          name: data.name,
          boardId: data.boardId,
          mediumId: data.mediumId,
          classId: data.classId,
          subjectId: data.subjectId,
          bookId: data.bookId,
          chapterId: data.chapterId,
          id: data.id
        })
        this.getMediumByBoardId(data, true);
        this.formType = "Update";
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  deleteLesson(id: any) {
    this.httpService.delete('lession', id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllLessons();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

}
