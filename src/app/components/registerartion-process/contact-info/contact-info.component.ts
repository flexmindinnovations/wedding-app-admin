import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { StepPath, findInvalidControlsRecursive } from 'src/util/util';

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
  isContactInfoFill: boolean = false;
  activePath: string = StepPath.CONTACT;
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
      this.activePath = splittedUrl[4];
      const extractCustomerId = Number(splittedUrl[splittedUrl.length - 2]);
      if (extractCustomerId && typeof extractCustomerId === 'number') {
        this.getCustomerDetails(extractCustomerId);
      }
    })
    this.initFormGroup();
    this.getCountryList();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.customerData?.currentValue) this.contactData = this.customerData['contactInfoModel'];
  }

  ngAfterViewInit(): void { }

  getCustomerDetails(customerId: any) {
    this.customerRegistrationService.getCustomerDetailsById(customerId).subscribe({
      next: (response) => {
        if (response) {
          this.customerData = response;
          const { isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded } = response;
          this.isContactInfoFill = response?.isContactInfoFill;
          if (isFamilyInfoFill) {
            this.customerData = response;
            this.isEditMode = response?.isContactInfoFill;
            this.contactData = response?.contactInfoModel;
            if (this.isEditMode) this.patchFormData();
            else {
              const customerUserName = response?.customerUserName;
              if(customerUserName) {
                this.formGroup.patchValue({contactNumber: customerUserName});
                this.formGroup.get('contactNumber')?.disable();
              }
            }
            this.setStepperData(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded);
          } else {
            this.router.navigateByUrl(`customers/edit/${customerId}/family`);
          }
        }
      },
      error: (error) => {
        this.alert.setAlertMessage('Something went wrong', AlertType.error);
      }
    })
  }

  setStepperData(isPersonInfoFill: boolean, isFamilyInfoFill: boolean, isContactInfoFill: boolean, isOtherInfoFill: boolean, isImagesAdded: boolean) {
    const props: FormStep = {
      source: StepPath.CONTACT,
      data: {},
      formId: 3,
      active: this.activePath === StepPath.CONTACT,
      isCompleted: this.isContactInfoFill,
      completeKey: StepPath.CONTACT,
      steps: { personal: isPersonInfoFill, family: isFamilyInfoFill, contact: isContactInfoFill, other: isOtherInfoFill, photos: isImagesAdded },
      previous: {
        source: StepPath.FAMILY,
        data: {},
        formId: 2,
        active: this.activePath === StepPath.FAMILY,
        isCompleted: isFamilyInfoFill
      },
      next: {
        source: StepPath.OTHER,
        data: {},
        formId: 4,
        active: this.activePath === StepPath.OTHER,
        isCompleted: isOtherInfoFill
      }
    }
    this.sharedService.stepData.next(props);
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

  handleClickOnNext(src: string) {
    const formVal = { ...this.formGroup.value, customerId: this.customerData.customerId, contactInfoId: 0 };
    formVal['contactNumber'] = formVal['contactNumber'] ? formVal['contactNumber'] : this.customerData['customerUserName'];
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src);
      else this.saveNewCustomerInfo(formVal, src);
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item + ' is required', AlertType.error);
      })
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, customerId, contactInfoId: 0 };
    this.customerRegistrationService.saveContactInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl(`customers/edit/${customerId}/other`);
        }
      },
      error: (error: any) => {
        this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const contactInfo = this.customerData['contactInfoModel'];
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, contactInfoId: contactInfo.contactInfoId };
    this.customerRegistrationService.updateContactInformation(payload, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl(`customers/edit/${customerId}/other`);
        }
      },
      error: (error: any) => {
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

        }
      })
    }
  }
}
