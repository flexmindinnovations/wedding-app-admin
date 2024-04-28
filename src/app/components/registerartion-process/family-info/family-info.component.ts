import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CastService } from 'src/app/services/cast/cast.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user/user.service';
import { findInvalidControlsRecursive } from 'src/util/util';

@Component({
  selector: 'family-info',
  templateUrl: './family-info.component.html',
  styleUrls: ['./family-info.component.scss'],
})
export class FamilyInfoComponent implements OnInit {

  @Input() completedStep!: FormStep;
  @Input() id: any;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  familyData: any;
  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  castService = inject(CastService);
  sharedService = inject(SharedService)

  @Output() familyInfoData = new EventEmitter();
  cdref = inject(ChangeDetectorRef);

  religionListOptions: any[] = [];
  castListOptions: any[] = [];
  subCastListOptions: any[] = [];

  hasSubCast: boolean = false;
  religionId: any;
  subCastId: any;
  customerId: any;
  activeRouter = inject(ActivatedRoute);
  customerService = inject(CustomerRegistrationService);
  isDataLoaded: boolean = false;

  isSubCastDataAvailable: boolean = false;

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
    this.getCastList();
    this.getReligionList();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    // if (changes?.customerData?.currentValue) this.familyData =JSON.parse(JSON.stringify(this.customerData['familyInfoModel']));
  }

  ngAfterViewInit(): void {
  }

  getCustomerDetails(customerId: any) {
    this.customerRegistrationService.getCustomerDetailsById(customerId).subscribe({
      next: (response) => {
        if (response) {
          const isPersonInfoFill = response?.isPersonInfoFill;
          if (isPersonInfoFill) {
            this.isEditMode = response?.isFamilyInfoFill;
            this.familyData = response?.familyInfoModel;
            if (this.isEditMode) this.patchFormData();
          } else {
            console.log('isPersonInfoFill: ', isPersonInfoFill);
            this.router.navigateByUrl(`customers/edit/${customerId}/personal`);
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
      fatherName: ['', [Validators.required]],
      fatherOccupation: ['', [Validators.required]],
      motherName: ['', [Validators.required]],
      motherOccupation: ['', [Validators.required]],
      noOfBrothers: ['', [Validators.required]],
      noOfMarriedBrothers: ['', [Validators.required]],
      noOfSisters: ['', [Validators.required]],
      noOfMarriedSisters: ['', [Validators.required]],
      religionId: ['', [Validators.required]],
      castId: ['', [Validators.required]],
      subCastId: ['', [Validators.required]]
    })
    this.getCastList();
    this.getReligionList();
  }

  patchFormData() {
    this.formGroup.patchValue(this.familyData);
    this.cdref.detectChanges();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnPrevious(src: string) {
    const formVal = this.formGroup.value;
    // if (this.formGroup.valid) {
    //   this.customerRegistrationService.saveFamilyInformation(formVal).subscribe({
    //     next: (data: any) => {
    //       if (data) {
    //         this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 2,
      action: ActionValue.previous,
      isCompleted: this.formGroup.valid
    }
    this.familyInfoData.emit(props);
    //       }
    //     },
    //     error: (error: any) => {
    //       console.log('error: ', error);
    //       this.alert.setAlertMessage('Personal Info: ' + error?.statusText, AlertType.error);
    //     }
    //   })
    // } else {
    //   const invalidFields = findInvalidControlsRecursive(this.formGroup);
    //   console.log('invalidFields: ', invalidFields);
    //   invalidFields.forEach((item: any) => {
    //     this.alert.setAlertMessage(item, AlertType.error);
    //   })
    // }
  }

  handleClickOnNext(src: string) {
    const formVal = { ...this.formGroup.value, customerId: this.completedStep?.data?.customerId };
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src);
      // else this.saveNewCustomerInfo(formVal, src);
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, familyInfoId: 0 };
    this.customerRegistrationService.saveFamilyInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, familyInfoId: data?.extractCustomerId },
            formId: 2,
            action: ActionValue.next,
            isCompleted: true,
            previous: {
              source: 'personal',
              data: {},
              formId: 1,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'contact',
              data: {},
              formId: 3,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.familyInfoData.emit(props);
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Family Info: ' + error?.statusText, AlertType.error);
        this.router.navigateByUrl(`customers/add/contact`);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, familyInfoId: this.familyData.familyInfoId };
    this.customerRegistrationService.updateFamilyInformation(payload, this.customerData?.customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, familyInfoId: data?.id },
            formId: 2,
            action: ActionValue.next,
            isCompleted: true,
            previous: {
              source: 'personal',
              data: {},
              formId: 1,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'contact',
              data: {},
              formId: 3,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.familyInfoData.emit(props);
          this.router.navigateByUrl(`customers/edit/${this.customerData?.customerId}/contact`, { state: { route: 'edit', pageName: 'Edit Customer', title: 'Edit Customer', customerId: this.customerId } });

        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Family Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'religionId':
        this.religionId = event?.religionId;
        break;
      case 'castId':
        this.hasSubCast = event?.hasSubcast;
        if (this.hasSubCast) this.getSubCastList(event?.id);
        break;
      case 'subCastId':
        const subCastId = event?.subCastId;
        this.subCastId = subCastId;
        break;
    }
  }

  getReligionList() {
    this.sharedService.getReligionList().subscribe({
      next: (response: any) => {
        if (response) {
          this.religionListOptions = response?.map((item: any) => {
            return {
              id: item?.religionId,
              title: item?.religionName,
            }
          })
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getCastList() {
    this.castService.getCastList().subscribe({
      next: (response: any) => {
        if (response) {
          this.castListOptions = response?.map((item: any) => {
            return {
              id: item?.castId,
              title: item?.castName,
              hasSubcast: item?.hasSubcast
            }
          })
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getSubCastList(castId: number) {
    this.subCastListOptions = [];
    this.isSubCastDataAvailable = false;
    this.castService.getSubCastListByCast(castId).subscribe({
      next: (response: any) => {
        if (response) {
          this.subCastListOptions = response?.map((item: any) => {
            return {
              id: item?.subCastId,
              title: item?.subCastName
            }
          })
          this.isSubCastDataAvailable = true;
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
