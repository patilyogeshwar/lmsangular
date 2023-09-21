import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SubjectMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-subject-master',
  templateUrl: './subject-master.component.html',
  styleUrls: ['./subject-master.component.css']
})
export class SubjectMasterComponent implements OnInit {

  subjectForm!: FormGroup;
  subjectMasterModel!: SubjectMasterClass;
  subjectArray!: FormArray;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  searchBox!: string;

  submitted = false;
  getAllData!: any[];
  allClasses!: any[];
  allMediums!: any[];
  allBoards!: any[];
  allSubjects!: any[];

  formType: string = "Save";

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.initializeValidations();
    this.getAllSubjects();
    this.getAllClasses();
    this.getAllMedium();
    this.getAllBoards();
    this.subjectArray = this.subjectForm.get('subjectArray') as FormArray;
  }

  initializeValidations() {
    this.subjectForm = this.fb.group({
      boardId: new FormControl(null, [
        Validators.required
      ]),
      mediumId: new FormControl(null, [
        Validators.required
      ]),
      classId: new FormControl(null, [
        Validators.required
      ]),
      subjectArray: this.fb.array([this.createItem()]),
      id: [""],
      thumbnail: ["Thumbnail"]
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: [undefined, [Validators.required]],
      order: [undefined, [Validators.required]]
    });
  }

  addSubject() {
    this.subjectArray = this.subjectForm.get('subjectArray') as FormArray;
    this.subjectArray.push(this.createItem());
  }

  removeSubject(data: any) {
    this.subjectArray.controls.forEach((item, i) => {
      if (item.value.name == data.value.name) {
        this.subjectArray.removeAt(i)
      }
    })
  }

  get f() { return this.subjectForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.subjectForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.tempSaveSubject();
    } else if (this.formType == "Update") {
      this.updateSubject();
    }
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllSubjects();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.getAllSubjects();
    }
  }

  saveSubject() {
    this.subjectMasterModel = this.subjectForm.value;
    let requestArray = [];
    let subjectModelArray: any = JSON.parse(JSON.stringify(this.subjectMasterModel));
    for (let i = 0; i < subjectModelArray.subjectArray.length; i++) {
      this.subjectMasterModel.name = subjectModelArray.subjectArray[i].name;
      this.subjectMasterModel.order = subjectModelArray.subjectArray[i].order;
      delete this.subjectMasterModel.subjectArray;
      requestArray.push(this.httpService.post('subjects', this.subjectMasterModel))
    }
    forkJoin(requestArray).subscribe(allResult => {
      this.getAllBoards();
      this.alertServiceService.success();
      this.getAllSubjects();
      this.subjectForm.reset();
    })
  }

  tempSaveSubject() {
    this.subjectMasterModel = this.subjectForm.value;
    let subjectModelArray: any = JSON.parse(JSON.stringify(this.subjectMasterModel));
    for (let i = 0; i < subjectModelArray.subjectArray.length; i++) {
      this.subjectMasterModel.name = subjectModelArray.subjectArray[i].name;
      this.subjectMasterModel.order = subjectModelArray.subjectArray[i].order;
      delete this.subjectMasterModel.subjectArray;
      delete this.subjectMasterModel.id;
      this.httpService.post('subjects', this.subjectMasterModel).subscribe((data: any) => {
        this.getAllBoards();
        this.alertServiceService.success();
        this.getAllSubjects();
        this.subjectForm.reset();
        this.submitted = false;
        this.subjectArray.clear();
        this.addSubject();
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  }

  updateSubject() {
    this.subjectMasterModel = this.subjectForm.value;
    let subjectModelArray: any = JSON.parse(JSON.stringify(this.subjectMasterModel));
    for (let i = 0; i < subjectModelArray.subjectArray.length; i++) {
      this.subjectMasterModel.name = subjectModelArray.subjectArray[i].name;
      delete this.subjectMasterModel.subjectArray;
      this.httpService.patch('subjects', this.subjectMasterModel).subscribe((data: any) => {
        this.getAllBoards();
        this.alertServiceService.success();
        this.getAllSubjects();
        this.subjectForm.reset();
        this.cancel()
        this.submitted = false;
        this.subjectArray.clear();
        this.addSubject();
      }, (error) => {
        this.alertServiceService.error();
      })
    }
    this.formType = "Save";
  }

  cancel() {
    this.subjectForm.reset();
    this.subjectArray.clear();
    this.addSubject();
    this.submitted = false;
    this.formType = 'Save'
  }

  getSubjectById(id: any) {
    this.httpService.get('subjects/' + id).subscribe((data: any) => {
      if (data) {
        this.subjectArray.clear()
        this.subjectArray.push(this.fb.group(data));
        this.subjectForm.patchValue({
          boardId: data.boardId,
          mediumId: data.mediumId,
          classId: data.classId,
          id: data.id
        })
        this.httpService.getById('medium/getAllmedium', data.boardId).subscribe((boardData: any) => {
          this.allMediums = boardData;
          this.getClassByMediumId(data.mediumId);
        }, (error) => {
          this.alertServiceService.error();
        })
        this.formType = "Update";
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  deleteSubject(id: any) {
    this.httpService.delete('subjects', id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllSubjects();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getAllSubjects() {
    this.httpService.get('subjects?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allSubjects = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getAllClasses() {
    this.httpService.get('classes').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasses = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getAllMedium() {
    this.httpService.get('medium?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMediums = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getAllBoards() {
    this.httpService.get('boards?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getMediumByBoardId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      this.httpService.getById('medium/getAllmedium', id).subscribe((data: any) => {
        this.allMediums = data;
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  }

  getClassByMediumId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event;
      this.httpService.getById('classes/getAllclassByMediumId', id).subscribe((data: any) => {
        this.allClasses = data;
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  }

  getSubjectByClassId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      this.httpService.getById('subjects/class', id).subscribe((data: any) => {
        this.allSubjects = data;
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  }

}
