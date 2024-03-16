import { state } from '@angular/animations';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, buttonThemeVariables, themeVariables } from 'src/util/util';
@Component({
  selector: 'app-add-edit-branch',
  templateUrl: './add-edit-branch.page.html',
  styleUrls: ['./add-edit-branch.page.scss'],
})
export class AddEditBranchPage implements OnInit {
  sharedService = inject(SharedService);
  branchService = inject(BranchService);
  router = inject(Router);
  alert = inject(AlertService);
  formGroup: any;
  countryList: any;
  stateList: any;
  cityList: any;
  isActive: boolean = true;
  colorScheme: any = COLOR_SCHEME;
  cssClass: any;
  selectedImage: any;

  countryId = undefined;
  stateId = undefined;
  cityId = undefined;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCountryList();
    this.setCurrentClass();
    // this.alert.setAlertMessage('Data Saved Successfully', AlertType.success);
  }

  setCurrentClass() {
    this.colorScheme = localStorage.getItem('color-scheme') || this.colorScheme;
    this.cssClass = themeVariables[this.colorScheme];
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      isActive: !['', Validators.required],
      branchName: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      // order: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      // console.log('form val: ', val);

    })
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'countryId':
        this.getStateByCountry(event?.id);
        break;
      case 'stateId':
        this.getCityByState(event?.id);
        break;
    }
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleSelectedImage(event: any) {
    this.selectedImage = event?.file;
  }

  handleSubmitClick() {
    let formVal = this.formGroup.value;
    formVal = { ...formVal, isActive: this.isActive, branchImagePath: '' }
    const formData: FormData = new FormData();
    formData.append('branchModel', JSON.stringify(formVal));
    if (this.selectedImage) formData.append('file', this.selectedImage, this.selectedImage.name);
    this.branchService.addBranch(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl('branch');
          this.branchService.setUpdate(true);
        }
      },
      error: (error) => {
        console.log('error: ', error.title);
        const err = error?.error;
        console.log('err: ', err);
        
        this.alert.setAlertMessage(err?.title, AlertType.error);
      }
    })
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  getCountryList() {
    this.sharedService.getCountryList().subscribe({
      next: (data: any) => {
        this.countryList = data?.map((item: any) => {
          const obj = {
            id: item?.countryId,
            title: item?.countryName
          }
          return obj;
        });
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }
  getStateByCountry(countryId: number) {
    if (countryId) {
      this.sharedService.getStatByCountry(countryId).subscribe({
        next: (data: any[]) => {
          this.stateList = data?.map((item: any) => {
            const obj = {
              id: item?.stateId,
              title: item?.stateName
            }
            return obj;
          });
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }

  }
  getCityByState(stateId: number) {
    if (stateId) {
      this.sharedService.getCityByState(stateId).subscribe({
        next: (data: any[]) => {
          this.cityList = data?.map((item: any) => {
            const obj = {
              id: item?.cityId,
              title: item?.cityName
            }
            return obj;
          });

        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }
  }


}
