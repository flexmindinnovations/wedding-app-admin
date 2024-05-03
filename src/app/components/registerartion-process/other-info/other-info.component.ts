import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { StepPath, findInvalidControlsRecursive } from 'src/util/util';

@Component({
  selector: 'other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss'],
})
export class OtherInfoComponent implements OnInit, AfterViewInit {

  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  otherData: any;
  @Output() otherInfoData = new EventEmitter();

  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  cdref = inject(ChangeDetectorRef);
  motherTongueListOptions: any = [];
  motherTongueId: any = ''
  sharedService = inject(SharedService);
  activeRouter = inject(ActivatedRoute);
  customerService = inject(CustomerRegistrationService);
  customerId = 0;
  isDataLoaded: boolean = false;
  activePath: string = StepPath.OTHER;

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
    this.getMotherTongueList();
  }

  ngAfterViewInit(): void { }

  getCustomerDetails(customerId: any) {
    this.customerRegistrationService.getCustomerDetailsById(customerId).subscribe({
      next: (response) => {
        if (response) {
          this.customerData = response;
          const { isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded } = response;
          if (isContactInfoFill) {
            this.customerData = response;
            this.isEditMode = response?.isOtherInfoFill;
            this.otherData = response?.otherInfoModel;
            if (this.isEditMode) this.patchFormData();
            this.setStepperData(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded);
          } else {
            this.router.navigateByUrl(`customers/edit/${customerId}/contact`);
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
      source: StepPath.OTHER,
      data: {},
      formId: 4,
      active: this.activePath === StepPath.OTHER,
      isCompleted: isOtherInfoFill,
      completeKey: StepPath.OTHER,
      steps: { personal: isPersonInfoFill, family: isFamilyInfoFill, contact: isContactInfoFill, other: isOtherInfoFill, photos: isImagesAdded },
      previous: {
        source: StepPath.CONTACT,
        data: {},
        formId: 3,
        active: this.activePath === StepPath.CONTACT,
        isCompleted: isContactInfoFill
      },
      next: {
        source: StepPath.PHOTOS,
        data: {},
        formId: 5,
        active: StepPath.PHOTOS === StepPath.PHOTOS,
        isCompleted: isImagesAdded
      }
    }
    this.sharedService.stepData.next(props);
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      expectations: ['', [Validators.required]],
      extraInformation: ['', [Validators.required]],
      motherTongueId: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((value: any) => { })
  }

  patchFormData() {
    this.formGroup.patchValue(this.otherData);
    this.cdref.detectChanges();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    const formVal = { ...this.formGroup.value, customerId: this.completedStep?.data?.customerId, otherInfoId: 0 };
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src);
      else this.saveNewCustomerInfo(formVal, src);
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }

  onSelectionChange(event: any, src: string) {
    if (src) {
      const motherTongueId = event?.motherTongueId;
      this.motherTongueId = motherTongueId;
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, customerId, otherInfoId: 0 };
    this.customerRegistrationService.saveOtherInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl(`customers/edit/${customerId}/photos`);
        }
      },
      error: (error: any) => {
        this.alert.setAlertMessage('Other Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const otherInfo = this.customerData['otherInfoModel'];
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, otherInfoId: otherInfo.otherInfoId };
    this.customerRegistrationService.updateOtherInformation(payload, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl(`customers/edit/${customerId}/photos`);
        }
      },
      error: (error: any) => {
        this.alert.setAlertMessage('Other Info: ' + error?.statusText, AlertType.error);
      }
    })
  }
  getMotherTongueList() {
    this.sharedService.getMotherTongueList().subscribe({
      next: (data: any) => {
        if (data) {
          this.motherTongueListOptions = data?.map((item: any) => {
            return {
              id: item?.motherTongueId,
              title: item?.motherTongueName,
            }
          });
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }
}
