import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  contactData: any;
  @Input() control!: FormControl | any;
  @Output() contactInfoData = new EventEmitter();

  isCountryListAvailable = false;
  isStateListAvailable = false;
  isCityListAvailable = false;

  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  sharedService = inject(SharedService);
  cdref = inject(ChangeDetectorRef);
  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  activeRouter = inject(ActivatedRoute);
  customerService = inject(CustomerRegistrationService);
  customerId = 0;
  isDataLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activedRoute.params.subscribe((params) => {
      const urlPath = window.location.pathname;
      const splittedUrl = urlPath.split('/');
      const extractCustomerId = Number(splittedUrl[splittedUrl.length - 2]);
      if (extractCustomerId && typeof extractCustomerId === 'number') {
        this.getCustomerDetails(extractCustomerId);
      }
    })
    this.initFormGroup();
    this.getCountryList();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    // if (changes?.customerData?.currentValue) this.contactData = this.customerData['contactInfoModel'];
  }

  ngAfterViewInit(): void {}

  getCustomerDetails(customerId: any) {
    this.customerRegistrationService.getCustomerDetailsById(customerId).subscribe({
      next: (response) => {
        if (response) {
          const isFamilyInfoFill = response?.isFamilyInfoFill;
          if (isFamilyInfoFill) {
            this.isEditMode = response?.isContactInfoFill;
            this.contactData = response?.contactInfoModel;
            console.log('this.contactData: ', this.contactData);
            if (this.isEditMode) this.patchFormData();
          } else {
            console.log('isFamilyInfoFill: ', isFamilyInfoFill);
            this.router.navigateByUrl(`customers/edit/${customerId}/family`);
          }
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Something went wrong', AlertType.error);
      }
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      // contactOf: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      whatsUpNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      emailId: ['', [Validators.required, Validators.email]],
      homeAddress: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
    })
  }

  patchFormData() {
    const contactData = { ...this.contactData, contactNumber: this.customerData['customerUserName'] };
    this.formGroup.patchValue(contactData);
    this.formGroup.get('contactNumber')?.disable();
    this.cdref.detectChanges();
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
      if (this.isEditMode) this.updateCustomerInfo(formVal, src);
      // else this.saveNewCustomerInfo(formVal, src);
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item + ' is required', AlertType.error);
      })
    }
  }

  // saveNewCustomerInfo(formVal: any, src: string): void {
  //   const payload = { ...formVal, contactInfoId: 0 };
  //   this.customerRegistrationService.saveContactInformation(payload).subscribe({
  //     next: (data: any) => {
  //       if (data) {
  //         this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
  //         const props: FormStep = {
  //           source: src,
  //           data: { ...formVal, contactInfoId: data?.id },
  //           formId: 3,
  //           action: ActionValue.next,
  //           isCompleted: data?.status,
  //           previous: {
  //             source: 'family',
  //             data: {},
  //             formId: 2,
  //             action: ActionValue.previous,
  //             isCompleted: true
  //           },
  //           next: {
  //             source: 'other',
  //             data: {},
  //             formId: 4,
  //             action: ActionValue.next,
  //             isCompleted: false
  //           }
  //         }
  //         this.contactInfoData.emit(props);
  //         this.router.navigateByUrl(`customers/add/other`);
  //       }
  //     },
  //     error: (error: any) => {
  //       console.log('error: ', error);
  //       this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
  //     }
  //   })
  // }

  updateCustomerInfo(formVal: any, src: string): void {
    const contactInfo = this.customerData['contactInfoModel'];
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, contactInfoId: contactInfo.contactInfoId };
    this.customerRegistrationService.updateContactInformation(payload, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, contactInfoId: data?.id },
            formId: 3,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: {
              source: 'family',
              data: {},
              formId: 2,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'other',
              data: {},
              formId: 4,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.contactInfoData.emit(props);
          this.router.navigateByUrl(`customers/edit/${customerId}/other` ,{ state: { route: 'edit', pageName: 'Edit Customer', title: 'Edit Customer', customerId: this.customerId } });
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
      }
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
