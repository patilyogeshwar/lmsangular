import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MediumMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-medium-master',
  templateUrl: './medium-master.component.html',
  styleUrls: ['./medium-master.component.css']
})
export class MediumMasterComponent implements OnInit {

  mainForm!: FormGroup;
  mediumMasterModel!: MediumMasterClass;
  mediumArray!: FormArray<any>;
  searchBox!: string;
  
  limit = 10;
  total: number = 0;
  page: number = 1;

  allMediums!: any[];
  formtype: string = "Save";
  allBoards!: any[];
  paginationConfig: any;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.formInitialize();
    this.getAllMedium();
    this.getAllBoards();
    this.mediumArray = this.mainForm.get('mediumArray') as FormArray;
    this.mainForm.reset()
  }

  formInitialize() {
    this.mainForm = this.fb.group({
      boardId: ["", [Validators.required]],
      id: [],
      mediumArray: this.fb.array([this.createItem()])
    });
  }

  addItem() {
    this.mediumArray = this.mainForm.get('mediumArray') as FormArray
    this.mediumArray.push(this.createItem());
  }
  createItem(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]]
    });
  }

  removeForm(index: number) {
    this.mediumArray.removeAt(index);
  }

  // Submit form with >> save >> Update.
  submitForm() {
    this.submitted = true;
    if (this.mainForm.invalid) {
      return;
    }
    if (this.formtype == "Save") {
      this.PostData();
    }
    else if (this.formtype == "Update") {
      this.UpdateData();
    }
  }

  PostData() {
    const asd: any = this.mainForm.controls;
    let tempArray = [];
    for (let i = 0; i < asd.mediumArray.value.length; i++) {
      this.mediumMasterModel = {
        boardId: asd.boardId.value,
        name: asd.mediumArray.value[i].name
      }
      console.log(this.mediumMasterModel);
      tempArray.push(this.httpService.post('medium', this.mediumMasterModel))
    }
    forkJoin(tempArray).subscribe((result: any) => {
      this.getAllMedium();
      this.alertServiceService.success();
      this.cancelMedium();
    })
    this.mainForm.reset()

  }


  UpdateData() {
    const asd: any = this.mainForm.controls;
    this.mediumMasterModel = {
      boardId: asd.boardId.value,
      name: asd.mediumArray.value[0].name,
      id: asd.id.value
    }
    console.log(this.mediumMasterModel);
    this.httpService.patch('medium', this.mediumMasterModel).subscribe((res: any) => {
      console.log(res);
      this.formtype = "Save";
      this.getAllMedium();
      this.alertServiceService.success();
      this.cancelMedium();
      this.mediumArray.clear()
      this.addItem()
    });
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllMedium();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = Number(event.target.value);
      this.getAllMedium();
    }
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
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total
        }
      }
    })
  }
  cancelMedium() {
    this.submitted = false;
    this.mainForm.reset();
    this.mediumArray.clear();
    this.addItem();
    this.formtype='Save'
  }

  editMediumData(data: any) {
    // console.log(data);
    this.mainForm.reset();
    this.mainForm.patchValue({
      boardId: data.boardId,
      id: data.id
    })
    this.mediumArray.clear();
    this.mediumArray.push(this.fb.group(data));
    this.formtype = "Update";
  }

  deleteMediumData(data: any) {
    this.httpService.delete('medium/', data.id).subscribe((data: any) => {
      console.log(data);
      this.getAllMedium();
      this.alertServiceService.delete();
    })
  }

}