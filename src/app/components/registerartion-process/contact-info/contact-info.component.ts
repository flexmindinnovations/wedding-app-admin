import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { findInvalidControlsRecursive } from 'src/util/util';

@Component({
  selector: 'contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
})
export class ContactInfoComponent implements OnInit, AfterViewInit {

  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;

  @Output() contactInfoData = new EventEmitter();

  isCountryListAvailable = false;
  isStateListAvailable = false;
  isCityListAvailable = false;

  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  sharedService = inject(SharedService);

  countryList: any = [];
  stateList: any = [];
  cityList: any = [];

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }
  
  ngAfterViewInit(): void {
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      // contactOf: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      whatsAppNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      homeAddress: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
    })

    this.getCountryList();

  }

  patchFormData() {
    this.formGroup.patchValue({
      contactNumber: '8446999858',
      whatsAppNumber: '8446999858',
      email: 'sample@email.com',
      homeAddress: 'Aurangabad',
      countryId: 1,
      stateId: 1,
      cityId: 1
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnPrevious(src: string) {
    const formVal = this.formGroup.value;
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 3,
      action: ActionValue.previous,
      // isCompleted: this.formGroup.valid
      isCompleted: true
    }
    this.contactInfoData.emit(props);
  }

  handleClickOnNext(src: string) {
    const formVal = { ...this.formGroup.value, customerId: this.completedStep?.data?.customerId, contactInfoId: 0 };
    if (this.formGroup.valid) {
      this.customerRegistrationService.saveContactInformation(formVal).subscribe({
        next: (data: any) => {
          if (data) {
            this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
            const props: FormStep = {
              source: src,
              data: { ...formVal, contactInfoId: data?.id },
              formId: 3,
              action: ActionValue.next,
              isCompleted: data?.status
            }
            this.contactInfoData.emit(props);
          }
        },
        error: (error: any) => {
          console.log('error: ', error);
          this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
        }
      })
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
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

  getCountryList() {
    this.sharedService.getCountryList().subscribe({
      next: (data: any) => {
        if (data) {
          this.countryList = data?.map((item: any) => {
            const obj = {
              id: item?.countryId,
              title: item?.countryName
            }
            return obj;
          });
          this.patchFormData();
          this.isCountryListAvailable = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  getStateByCountry(countryId: number) {
    if (countryId) {
      this.stateList = [];
      this.cityList = [];
      this.sharedService.getStatByCountry(countryId).subscribe({
        next: (data: any[]) => {
          if (data) {
            this.stateList = data?.map((item: any) => {
              const obj = {
                id: item?.stateId,
                title: item?.stateName
              }
              return obj;
            });
            this.isStateListAvailable = true;
          }
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }

  }
  getCityByState(stateId: number) {
    this.cityList = [];
    if (stateId) {
      this.sharedService.getCityByState(stateId).subscribe({
        next: (data: any[]) => {
          if (data) {
            this.cityList = data?.map((item: any) => {
              const obj = {
                id: item?.cityId,
                title: item?.cityName
              }
              return obj;
            });
            this.isCityListAvailable = true;
          }
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }
  }
}
