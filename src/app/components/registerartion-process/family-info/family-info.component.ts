import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CastService } from 'src/app/services/cast/cast.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user/user.service';
import { StepPath, findInvalidControlsRecursive } from 'src/util/util';

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
  isDataAvailable = false;
  isSubCastDataAvailable: boolean = false;
  isFamilyInfoFill: boolean = false;
  activePath: string = StepPath.FAMILY;
  isAddMode: boolean = false;

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
      this.isAddMode = splittedUrl.includes('add');
      this.activePath = splittedUrl.includes('edit') ? splittedUrl[4] : splittedUrl[3];
      if (this.isAddMode) { } else {
        const extractCustomerId = Number(splittedUrl[splittedUrl.length - 2]);
        if (extractCustomerId && typeof extractCustomerId === 'number') {
          this.getCustomerDetails(extractCustomerId);
        }
      }
    })
    this.initFormGroup();
    this.getMasterData();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.customerData?.currentValue) this.familyData = JSON.parse(JSON.stringify(this.customerData['familyInfoModel']));
  }

  ngAfterViewInit(): void {
  }

  getCustomerDetails(customerId: any) {
    this.customerRegistrationService.getCustomerDetailsById(customerId).subscribe({
      next: (response) => {
        if (response) {
          this.customerData = response;
          const { isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded } = response;
          this.customerId = response?.customerId
          this.isFamilyInfoFill = response?.isFamilyInfoFill;
          if (isPersonInfoFill) {
            this.isEditMode = response?.isFamilyInfoFill;
            this.familyData = response?.familyInfoModel;
            this.setStepperData(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded);
            if (this.isEditMode) this.patchFormData();
          } else {
            this.router.navigateByUrl(`customers/edit/${customerId}/personal`);
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
      source: StepPath.FAMILY,
      data: {},
      formId: 2,
      active: this.activePath === StepPath.FAMILY,
      isCompleted: isFamilyInfoFill,
      completeKey: StepPath.FAMILY,
      steps: { personal: isPersonInfoFill, family: isFamilyInfoFill, contact: isContactInfoFill, other: isOtherInfoFill, photos: isImagesAdded },
      previous: {
        source: StepPath.PERSONAL,
        data: {},
        formId: 1,
        active: this.activePath === StepPath.PERSONAL,
        isCompleted: isPersonInfoFill
      },
      next: {
        source: StepPath.CONTACT,
        data: {},
        formId: 3,
        active: this.activePath === StepPath.CONTACT,
        isCompleted: isContactInfoFill
      }
    }
    this.sharedService.stepData.next(props);
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
  }

  patchFormData() {
    this.formGroup.patchValue(this.familyData);
    this.cdref.detectChanges();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    const customerId = localStorage.getItem('customer')
    const formVal = { ...this.formGroup.value, customerId: this.customerId };
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
  saveNewCustomerInfo(formVal: any, src: string): void {
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, customerId, familyInfoId: 0 };
    this.customerRegistrationService.saveFamilyInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl(`customers/edit/${this.customerId}/contact`);
        }
      },
      error: (error: any) => {
        this.alert.setAlertMessage('Family Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, familyInfoId: this.familyData.familyInfoId };
    this.customerRegistrationService.updateFamilyInformation(payload, this.customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl(`customers/edit/${this.customerId}/contact`);
        }
      },
      error: (error: any) => {
        this.alert.setAlertMessage('Family Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'religionId':
        this.religionId = event?.id;
        this.castListOptions = [];
        this.subCastListOptions = [];
        this.getCastListByReligionId(this.religionId);
        break;
      case 'castId':
        this.hasSubCast = event?.hasSubcast;
        this.subCastListOptions = [];
        if (this.hasSubCast) this.getSubCastList(event?.id);
        break;
      case 'subCastId':
        const subCastId = event?.subCastId;
        this.subCastId = subCastId;
        break;
    }
  }

  getMasterData() {
    const religion = this.sharedService.getReligionList();
    forkJoin({ religion })
      .subscribe({
        next: async (result) => {
          this.isDataAvailable = true;
          const { religion } = result;
          this.religionListOptions = religion?.map((item: any) => {
            return {
              id: item?.religionId,
              title: item?.religionName,
            }
          })
          this.cdref.detectChanges();
        },
        error: (error: Error) => {
          this.alert.setAlertMessage('Error while processing request', AlertType.error);
        }
      })
  }


  getCastListByReligionId(religionId: number) {
    this.castService.getCastListByReligionId(religionId).subscribe({
      next: (response: any) => {
        if (response) {
          this.castListOptions = response?.map((item: any) => {
            return {
              id: item?.castId,
              title: item?.castName,
              hasSubcast: item?.hasSubcast
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
  getSubCastList(castId: number) {
    this.subCastListOptions = [];
    this.isSubCastDataAvailable = false;
    this.castService.getSubCastListByCast(castId).subscribe({
      next: (response: any) => {
        if (response) {
          this.subCastListOptions = response?.map((item: any) => {
            return {
              id: item?.subCastId,
              title: item?.subCastName,
              castId,
              subCastId: item?.subCastId
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
