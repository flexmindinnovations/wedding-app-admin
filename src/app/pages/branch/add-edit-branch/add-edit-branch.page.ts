import { state } from '@angular/animations';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { BranchService } from 'src/app/services/branch/branch.service';
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, buttonThemeVariables, themeVariables } from 'src/util/util';
@Component({
  selector: 'app-add-edit-branch',
  templateUrl: './add-edit-branch.page.html',
  styleUrls: ['./add-edit-branch.page.scss'],
})
export class AddEditBranchPage implements OnInit {
  sharedService = inject(SharedService)
  branchService = inject(BranchService)
  formGroup: any;
  countryList: any;
  stateList: any;
  cityList: any;
  isActive: boolean = true;
  colorScheme: any = COLOR_SCHEME;
  cssClass: any;
  selectedImage: any;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCountryList();
    this.setCurrentClass();
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
      console.log('form val: ', val);

    })
  }

  onSelectionChange(event: any, src: string) {
    console.log('event onSelectionChange: ', event);
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
    console.log('formVal: ', JSON.stringify(formVal));
    const formData = new FormData();
    formData.append('branchModel', JSON.stringify(formVal));
    formData.append('file', this.selectedImage, this.selectedImage.name);
    console.log(this.selectedImage);
    this.branchService.addBranch(formData).subscribe({
      next: (data: any) => {
        console.log('branch added success', data)
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  getCountryList() {
    this.sharedService.getCountryList().subscribe({
      next: (data: any[]) => {
        // console.log('data : ', data);

        this.countryList = data.map((item: any) => {
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
          this.stateList = data.map((item: any) => {
            const obj = {
              id: item?.stateId,
              title: item?.stateName
            }
            return obj;
          });
          console.log(data)

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
          this.cityList = data.map((item: any) => {
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
