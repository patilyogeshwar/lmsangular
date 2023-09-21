import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ChapterMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-chapter-master',
  templateUrl: './chapter-master.component.html',
  styleUrls: ['./chapter-master.component.css']
})
export class ChapterMasterComponent implements OnInit {
  ChapterForm: any = FormGroup;
  chapterArray!: FormArray;
  chapterMasterModel!: ChapterMasterClass;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  searchBox!: string;

  submitted: boolean = false;
  allChapter!: any[];
  ClassList!: any[];
  MediumList!: any[];
  BoardsList!: any[];
  SubjectList!: any[];
  BooksList!: any[];
  formType: string = "Save";

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.initializeValidations();
    this.getAllChapters();
    this.getAllClasses();
    this.getAllMedium();
    this.getAllBoards();
    this.getAllBooks();
    this.getAllSubject();
    this.chapterArray = this.ChapterForm.get('chapterArray') as FormArray;
    this.ChapterForm.reset();
  }

  initializeValidations() {
    this.ChapterForm = this.fb.group({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, Validators.required),
      classId: new FormControl(null, Validators.required),
      subjectId: new FormControl(null, Validators.required),
      bookId: new FormControl(null, Validators.required),
      chapterArray: this.fb.array([this.createItem()]),
      id: [null]
    });
  }

  get f() { return this.ChapterForm.controls; }

  createItem(): FormGroup {
    return this.fb.group({
      chapterName: [undefined, [Validators.required]],
      thumbnail: [undefined, [Validators.required]],
      order: [undefined, [Validators.required]],
    });
  }

  addchapter() {
    this.chapterArray = this.ChapterForm.get('chapterArray') as FormArray;
    this.chapterArray.push(this.createItem());
  }

  removechapter(data: any) {
    this.chapterArray.controls.forEach((item, i) => {
      if (item.value.name == data.value.name) {
        this.chapterArray.removeAt(i)
      }
    })
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllChapters();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.getAllChapters();
    }
  }

  onSave() {
    this.submitted = true;
    console.log(this.ChapterForm.value);

    if (this.ChapterForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveChapter();
    }
    else if (this.formType == "Update") {
      this.updateBooks();
    }
  }

  saveChapter() {
    this.chapterMasterModel = this.ChapterForm.value;
    delete this.chapterMasterModel.chapterArray;
    delete this.chapterMasterModel.id;
    for (let i = 0; i < this.chapterArray.value.length; i++) {
      this.chapterMasterModel.thumbnail = this.chapterArray.value[i].thumbnail;
      this.chapterMasterModel.chapterName = this.chapterArray.value[i].chapterName;
      this.chapterMasterModel.order = this.chapterArray.value[i].order;
      this.httpService.post('chapter', this.chapterMasterModel).subscribe((data: any) => {
        this.alertServiceService.success();
        this.formType = "Save";
        this.submitted = false;
        this.getAllChapters();
        this.ChapterForm.reset();
        this.chapterArray.clear();
        this.addchapter();
      })
    }
  }

  updateBooks() {
    this.chapterMasterModel = this.ChapterForm.value;
    delete this.chapterMasterModel.chapterArray;
    for (let i = 0; i < this.chapterArray.value.length; i++) {
      this.chapterMasterModel.thumbnail = this.chapterArray.value[i].thumbnail;
      this.chapterMasterModel.chapterName = this.chapterArray.value[i].chapterName;
      this.chapterMasterModel.order = this.chapterArray.value[i].order;
      this.httpService.patch('chapter', this.chapterMasterModel).subscribe((data: any) => {
        this.alertServiceService.success();
        this.formType = "Save";
        this.submitted = false;
        this.getAllChapters();
        this.ChapterForm.reset();
        this.chapterArray.clear();
        this.addchapter();
      })
    }
  }

  onFileSelect(event: any) {
    // file upload with api with event.target.files[0]; & received the image url
    this.ChapterForm.controls.chapterArray.controls[Number(event.target.id)].controls.thumbnail.patchValue("https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000")
    this.chapterArray.value[Number(event.target.id)].thumbnail = "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000";
  }

  onEditChapter(data: any) {
    console.log(data);
    this.chapterArray.clear();
    this.chapterArray.push(this.fb.group(data));
    this.ChapterForm.patchValue({
      boardId: data.boardId,
      mediumId: data.mediumId,
      classId: data.classId,
      subjectId: data.subjectId,
      bookId: data.bookId,
      id: data.id,
      order: data.order
    });
    this.formType = "Update";
  }

  cancelBtn() {
    this.submitted = false;
    this.ChapterForm.reset();
    this.formType = "Save"
  }

  deleteSubject(id: any) {
    this.httpService.delete('chapter', id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllChapters();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getAllChapters() {
    this.httpService.get('chapter?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allChapter = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      }
    })
  }

  getAllClasses() {
    this.httpService.get('classes').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.ClassList = data.results;
      }
    })
  }

  getAllMedium() {
    this.httpService.get('medium?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.MediumList = data.results;
      }
    })
  }

  getAllBoards() {
    this.httpService.get('boards?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.BoardsList = data.results;
      }
    })
  }

  getAllSubject() {
    this.httpService.get('subjects?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.SubjectList = data.results;
      }
    })
  }

  getAllBooks() {
    this.httpService.get('books?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.BooksList = data.results;
      }
    })
  }

  getMediumByBoardId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.boardId;
      this.httpService.getById('medium/getAllmedium', id).subscribe((data: any) => {
        this.MediumList = data;
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
        this.ClassList = data;
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
        this.SubjectList = data;
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
        this.BooksList = data;
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
        this.allChapter = data;
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  };
}