import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ReplaySubject, forkJoin } from 'rxjs';
import { ClassMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-class-master',
  templateUrl: './class-master.component.html',
  styleUrls: ['./class-master.component.css']
})
export class ClassMasterComponent {

  submitted: boolean = false;
  searchBox!: string;
  classForm: any = FormGroup;
  classArray!: FormArray;
  formType: string = "Save";
  allClasss!: any[];
  allMedium!: any[];
  ClassMasterModel!: ClassMasterClass;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService) {
  }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.getAllMedium();
    this.getAllClass();
    this.classArray = this.classForm.get('classArray') as FormArray;
  }

  initializeSaveFormValidations() {
    this.classForm = this.fb.group({
      mediumId: ['', [Validators.required]],
      classArray: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      className: [undefined, [Validators.required]],
      order: [undefined, [Validators.required]]
    });
  }

  addClass() {
    this.classArray = this.classForm.get('classArray') as FormArray;
    this.classArray.push(this.createItem());
  }

  removeClass(data: any) {
    if (data.value.className) {
      this.classArray.controls.forEach((item, i) => {
        if (item.value.className == data.value.className) {
          this.classArray.removeAt(i)
        }
      })
    } else {
      this.classArray.removeAt(this.classArray.length - 1);
    }
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllClass();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.getAllClass();
    }
  }

  submitForm() {
    this.submitted = true;
    if (this.classForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveClass();
    } else if (this.formType == "Update") {
      this.updateclass();
    }

  }

  saveClass() {
    const asd: any = this.classForm.controls;
    console.log(asd);

    let tempArray = [];
    for (let i = 0; i < asd.classArray.value.length; i++) {
      this.ClassMasterModel = {
        mediumId: asd.mediumId.value,
        className: asd.classArray.value[i].className,
        order: asd.classArray.value[i].order
      }
      console.log(this.ClassMasterModel);
      tempArray.push(this.httpService.post('classes', this.ClassMasterModel))
      console.log();

    }
    forkJoin(tempArray).subscribe((result: any) => {
      this.getAllClass();
      this.alertServiceService.success();
      this.cancel()

    })

  }


  updateclass() {
    const formData: any = this.classForm.controls;
    console.log(formData);
    this.ClassMasterModel = {
      mediumId: formData.mediumId.value,
      id: formData.classArray.value[0].id,
      className: formData.classArray.value[0].className,
      order: formData.classArray.value[0].order

    }
    console.log(this.ClassMasterModel);
    this.httpService.patch('classes', this.ClassMasterModel).subscribe((res: any) => {
      console.log(res);
      this.getAllClass();
      this.cancel()
      this.submitted = false;
      this.alertServiceService.success();

    }, (error) => {
      this.alertServiceService.error();
    });
    this.formType = "Save";

  }
  cancel() {
    this.submitted = false;
    this.ngOnInit()
    this.formType = 'Save'
  }

  getAllClass() {
    this.httpService.get('classes?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasss = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: 11, directionLinks: false
        }
      }
    })
  }
  getAllMedium() {
    this.httpService.get('medium?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMedium = data.results;
        console.log(this.allMedium);

      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getClassByMediumId(event: any) {
    if (event.target.value) {
      const id = event.target.value;
      this.httpService.getById('classes/getAllclassByMediumId', id).subscribe((data: any) => {
        this.allClasss = data;
        console.log(this.allMedium);
        console.log(this.allMedium);
      })
    }
  }

  editClassData(data: any) {
    // console.log(data);
    this.classForm.reset();
    this.classForm.patchValue({
      mediumId: data.mediumId,
      id: data.id

    })
    this.classArray.clear();
    this.classArray.push(this.fb.group(data));
    this.formType = "Update";
  }

  deleteClass(data: any) {
    console.log(data);
    this.httpService.delete('classes', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllClass();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  get f() {
    return this.classForm.controls;
  }


}