import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { BookMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';


@Component({
  selector: 'app-book-master',
  templateUrl: './book-master.component.html',
  styleUrls: ['./book-master.component.css']
})
export class BookMasterComponent implements OnInit {

  bookForm: any = FormGroup;
  BookMasterModule!: BookMasterClass;
  bookArray!: FormArray;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  searchBox!: string;

  allClasses!: any[];
  allMediums!: any[];
  allBoards!: any[];
  allSubjects!: any[];
  allBooks!: any[];
  formType: string = "Save";
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.initializeValidations();
    this.getAllSubjects();
    this.getAllClasses();
    this.getAllMedium();
    this.getAllBoards();
    this.getAllBooks();
    this.bookArray = this.bookForm.get('bookArray') as FormArray;
  }
  initializeValidations() {
    this.bookForm = this.fb.group({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, [Validators.required]),
      classId: new FormControl(null, [Validators.required]),
      subjectId: new FormControl(null, [Validators.required]),
      bookArray: this.fb.array([this.createItem()]),
      id: []
    })
  }
  get f() { return this.bookForm.controls; }
  createItem(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]]
    });
  }
  addBook() {
    this.bookArray = this.bookForm.get('bookArray') as FormArray;
    this.bookArray.push(this.createItem());
  }

  removeBook(data: any) {
    this.bookArray.controls.forEach((item, i) => {
      if (item.value.name == data.value.name) {
        this.bookArray.removeAt(i)
      }
    })
  }

  cancelBtn() {
    this.submitted = false;
    this.bookForm.reset();
    this.bookArray.clear();
    this.addBook();
    this.formType='Save'
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllBooks();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.getAllBooks();
    }
  }

  // Api calls
  onSave() {
    this.submitted = true;
    console.log(this.bookForm);

    if (this.bookForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveBooks();
    }
    else if (this.formType == "Update") {
      this.updateBooks();
    }
  }

  saveBooks() {
    const data: any = this.bookForm.controls
    console.log(data);
    let tempArray = [];
    for (let i = 0; i < data.bookArray.controls.length; i++) {
      this.BookMasterModule = {
        name: data.bookArray.value[i].name,
        boardId: data.boardId.value,
        mediumId: data.mediumId.value,
        classId: data.classId.value,
        subjectId: data.subjectId.value
      }
      tempArray.push(this.httpService.post('books', this.BookMasterModule))
    }
    forkJoin(tempArray).subscribe(allResult => {
      this.getAllBoards();
      this.alertServiceService.success();
      this.getAllSubjects();
      this.cancelBtn();
      this.getAllBooks();
      this.submitted = false;
    });
  }

  updateBooks() {
    const formData: any = this.bookForm.controls;
    this.BookMasterModule = {
      boardId: formData.boardId.value,
      name: formData.bookArray.value[0].name,
      mediumId: formData.mediumId.value,
      classId: formData.classId.value,
      subjectId: formData.subjectId.value,
      id: formData.id.value
    }
    console.log(this.BookMasterModule);
    this.httpService.patch('books', this.BookMasterModule).subscribe((res: any) => {
      console.log(res);
      this.formType = "Save";
      this.getAllBooks();
      this.bookArray.clear();
      this.cancelBtn();
      this.alertServiceService.success();
    }, (error) => {
      this.alertServiceService.error();
    });

  }

  // getting all data fro Board, Medium, Classes, Subject And Books :-
  getAllClasses() {
    this.httpService.get('classes').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasses = data.results;
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

  getAllBoards() {
    this.httpService.get('boards?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    })
  }

  getAllSubjects() {
    this.httpService.get('subjects?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allSubjects = data.results;
      }
    })
  }
  getAllBooks() {
    this.httpService.get('books?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBooks = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      }
    })
  }

  deleteBookData(data: any) {
    this.httpService.delete('books', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllBooks();
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  editBookData(data: any) {
    console.log(data.boardId);
    this.bookArray.clear();
    this.bookArray.push(this.fb.group(data));
    this.bookForm.patchValue({
      boardId: data.boardId,
      mediumId: data.mediumId,
      classId: data.classId,
      subjectId: data.subjectId,
      id: data.id,
    });
    this.formType = "Update";
    console.log(this.bookForm.value);
  }

  getMediumByBoardId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      this.httpService.getById('medium/getAllmedium', id).subscribe((data: any) => {
        this.allMediums = data;
      })
    }
  }

  getClassByMediumId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      this.httpService.getById('classes/getAllclassByMediumId', id).subscribe((data: any) => {
        this.allClasses = data;
      })
    }
  }

  getSubjectByClassId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      this.httpService.getById('subjects/class', id).subscribe((data: any) => {
        this.allSubjects = data;
      })
    }
  }

  getBooksBySubjectId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      console.log(event.target.value);

      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.allBooks = data;
      })
    }
  }
}
