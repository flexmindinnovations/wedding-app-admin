import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, buttonThemeVariables, themeVariables } from 'src/util/util';
@Component({
  selector: 'app-add-edit-branch',
  templateUrl: './add-edit-branch.page.html',
  styleUrls: ['./add-edit-branch.page.scss'],
})
export class AddEditBranchPage implements OnInit {
  sharedService = inject(SharedService)
  formGroup: any;
  countryList: any;
  stateList: any;
  cityList: any;
  isActive: boolean = true;
  inActive: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  cssClass: any;

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
      isActive: [false, Validators.required],
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
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
      case 'country':
        this.getStateByCountry(event?.id);
        break;
      case 'state':
        this.getCityByState(event?.id);
        break;
    }
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

  toggleActive() {
    this.isActive = !this.isActive;
    this.inActive = !this.inActive;
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
  getCityByState(stateId: number) {
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
