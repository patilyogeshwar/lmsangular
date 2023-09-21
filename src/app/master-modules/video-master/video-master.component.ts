import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PlanMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-plan-master',
  templateUrl: './video-master.component.html',
  styleUrls: ['./video-master.component.css']
})
export class VideoMasterComponent {

  boardForm!: FormGroup;
  boardMasterModel!: PlanMasterClass[];
  boardArray!: FormArray;
  searchBox!: string;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

  getAllData!: any[];
  formType: string = "Save";
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) {
  }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.boardArray = this.boardForm.get('boardArray') as FormArray;
    this.getAllBoards();

  }

  initializeSaveFormValidations() {
    this.boardForm = this.fb.group({
      boardArray: this.fb.array([this.createItem()])
    });
  }
   
  createItem(): FormGroup {
    return this.fb.group({
      studioName: ["studioName", [Validators.required]],
      location: ["location", [Validators.required]]  
     

    });
  }

  addBoard() {
    this.boardArray = this.boardForm.get('boardArray') as FormArray;
    this.boardArray.push(this.createItem());
  }

  removeBoard(data: any) { 
    this.boardArray.controls.forEach((item, i) => {
      if (item.value.name == data.value.name) {
        this.boardArray.removeAt(i)
      }
    })
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllBoards();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.getAllBoards();
    }
  }

  get f() { return this.boardForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.boardForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveBoard();
    } else if (this.formType == "Update") {
      this.updateBoard();
    }
  }

  saveBoard() {
    
    this.boardMasterModel = this.boardForm.value['boardArray'];
    let requestArray = [];
    debugger
   // console.log(this.boardMasterModel); 
     console.log(this.boardMasterModel); 
    for (let i = 0; i < this.boardMasterModel.length; i++) {              
      requestArray.push(this.httpService.post('studio', this.boardMasterModel[i]));    
    }
    
    forkJoin(requestArray).subscribe(allResult => {
      this.getAllBoards();
      this.alertServiceService.success();
      this.submitted = false;
      this.boardArray.clear();
      this.addBoard()
    })
     
  }

  updateBoard() {
    this.boardMasterModel = this.boardForm.value['boardArray'];
    const data: any = this.boardMasterModel;
    this.httpService.patch('studio', data[0]).subscribe((data: any) => {
      this.getAllBoards();
      this.alertServiceService.success();
      this.formType = "Save";
      this.submitted = false;
      this.boardArray.clear();
      this.addBoard()
    });
  }

  deleteBoard(id: any) {
    this.httpService.delete('studio', id).subscribe((data: any) => {
      this.getAllBoards();
      this.alertServiceService.delete();
    });
  }

  cancelBoard() {
    this.submitted = false;
    this.boardArray.clear();
    this.addBoard()
    this.formType = "Save"
  }

  getAllBoards() {
    this.httpService.get('studio?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.getAllData = data.results; 
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      }
    })
  }

  getBoardById(id: any) {
    this.httpService.get('studio/' + id).subscribe((data: any) => {
      if (data) {
        this.boardArray.clear()
        this.boardArray.push(this.fb.group(data));
        this.formType = "Update";
      }
    })
  }

}
