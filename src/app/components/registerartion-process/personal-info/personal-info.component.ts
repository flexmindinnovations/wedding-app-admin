import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { EducationService } from 'src/app/services/education/education.service';
import { HeightService } from 'src/app/services/height/height.service';
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, TITHI_LIST, findInvalidControlsRecursive, getRandomNumber, inputThemeVariables } from 'src/util/util';

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, OnChanges, AfterViewInit {

  formGroup!: FormGroup;
  genderOptions: any = [];
  maritalStatusOptions: any = [];
  educationListOptions: any = [];
  heightListOptions: any = [];
  physicalStatusListOptions: any = [];
  specializationListOptions: any = [];
  bloodGroupListOptions: any = [];
  foodPreferencesListOptions: any = [];
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  showPatrika: boolean = false;
  isEditMode: boolean = false;
  personalData: any;

  @Output() personalInfoData = new EventEmitter();
  educationService = inject(EducationService);
  heightService = inject(HeightService);
  alert = inject(AlertService);
  sharedService = inject(SharedService);
  customerRegistrationService = inject(CustomerRegistrationService);
  cdref = inject(ChangeDetectorRef);

  hasSpecialization: boolean = false;
  isOtherPhyicalCondition: boolean = false;

  specializationId = '';
  isDataAvailable = false;
  isSpecializationDataAvailable = false;
  tithiList: any[] = TITHI_LIST;

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;

  constructor(
    private fb: FormBuilder
  ) {
    this.setCurrentClass();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = inputThemeVariables[this.colorScheme];
  }

  ngOnInit() {
    this.initFormGroup();
    this.getMasterData();
    this.genderOptions = [
      { id: 'male', title: 'Male' },
      { id: 'female', title: 'Female' },
    ];

    this.maritalStatusOptions = [
      { id: 'married', title: 'Married' },
      { id: 'single', title: 'Single' },
      { id: 'divorced', title: 'Divorced' },
      { id: 'widowed', title: 'Widowed' }
    ]
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.customerData?.currentValue) this.personalData = JSON.parse(JSON.stringify(this.customerData['personalInfoModel']));
  }

  ngAfterViewInit(): void {
    if (this.personalData) {
      this.isEditMode = this.personalData?.personalInfoId > 0 ? true : false;
      if (this.isEditMode) this.patchValue();
    }
    this.cdref.detectChanges();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      locationOfBirth: ['', [Validators.required]],
      shakeDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      heightId: ['', [Validators.required]],
      eduationId: ['', [Validators.required]],
      specializationId: ['', [Validators.required]],
      dateOfBirth: [new Date(), [Validators.required]],
      occupation: ['', [Validators.required]],
      physicalStatus: ['', [Validators.required]],
      otherPhysicalCondition: ['', ![Validators.required]],
      maritalStatus: ['', [Validators.required]],
      hobbies: ['', ![Validators.required]],
      bloodGroup: ['', ![Validators.required]],
      foodPreference: ['', ![Validators.required]]
    });
  }

  patchValue() {
    this.formGroup.patchValue({
      ...this.personalData,
      dateOfBirth: new Date(this.personalData['dateOfBirth'])
    });
    this.cdref.detectChanges();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    const formVal = this.formGroup.value;
    formVal['specializationId'] = this.specializationId ? this.specializationId : '';
    formVal['dateOfBirth'] = new Date(formVal['dateOfBirth']);
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src)
      else this.saveNewCustomerInfo(formVal, src)
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, personalInfoId: 0 };
    this.customerRegistrationService.savePersonalInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          const props: FormStep = {
            source: src,
            data: { ...formVal, customerId: data?.id },
            formId: 1,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: null,
            next: {
              source: 'family',
              data: {},
              formId: 2,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.personalInfoData.emit(props);
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Personal Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, personalInfoId: this.personalData.personalInfoId };
    this.customerRegistrationService.updatePersonalInformation(payload, this.customerData?.customerId).subscribe({
      next: (data: any) => {
        if (data) {
          const props: FormStep = {
            source: src,
            data: { ...formVal, customerId: data?.id },
            formId: 1,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: null,
            next: {
              source: 'family',
              data: {},
              formId: 2,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.personalInfoData.emit(props);
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Personal Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  getMasterData() {
    const education = this.educationService.getEducationList();
    const height = this.heightService.getHeightList();
    const handycap = this.sharedService.getHandyCapItemList();
    const bloodGroup = this.sharedService.getBloodGroupList();
    const foodPreferences = this.sharedService.getFoodPreferencesList();
    forkJoin({ education, height, handycap, bloodGroup, foodPreferences })
      .subscribe({
        next: async (result) => {
          this.isDataAvailable = true;
          const { education, height, handycap, bloodGroup, foodPreferences } = result;          
          this.heightListOptions = height.map((item: any) => {
            return { id: item?.heightId, title: item?.heightName }
          });
          this.educationListOptions = education.map((item: any) => {
            return {
              id: item?.educationId,
              title: item?.educationName,
              hasSpecialization: item?.hasSpecialization
            }
          });
          this.physicalStatusListOptions = handycap.map((item: any) => {
            return {
              id: item?.handycapId,
              title: item?.handycapName,
            }
          });
          this.bloodGroupListOptions = bloodGroup.map((item: any) => {
            return {
              id: item?.bloodGroupId,
              title: item?.bloodGroupName,
            }
          });
          this.foodPreferencesListOptions = foodPreferences.map((item: any) => {
            return {
              id: item?.foodId,
              title: item?.foodName,
            }
          });
        },
        error: (error: Error) => {
          console.log('error: ', error);
          this.alert.setAlertMessage('Error while processing request', AlertType.error);
        }
      })
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'educationId':
        this.hasSpecialization = event?.hasSpecialization;
        if (this.hasSpecialization) this.getSpecialization(event?.id);
        break;
      case 'specializationId':
        const specializationId = event?.specializationId;
        this.specializationId = specializationId;
        break;
      case 'gender':
        break;
      case 'maritalStatus':
        break;
      case 'height':

        break;
      case 'physicalStatus':
        this.isOtherPhyicalCondition = event?.id === 7;
        break;

    }
  }

  handlePatrikaStateChange(event: any) {
    this.tithiList.forEach((row: any) => row.tithi = false);
    const value = event?.currentTarget.checked;
    this.showPatrika = value;
  }

  handleTithiStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    item.tithi = value;
  }

  handleOnTithiChange(event: any, item: any) {
    const value = event.target.value;
    item.description = value;
  }

  getSpecialization(educationId: number) {
    this.educationService.getSpecializationListByEducationId(educationId).subscribe({
      next: (data: any) => {
        if (data) {
          this.specializationListOptions = data.map((item: any) => {
            return {
              id: item?.educationId,
              title: item?.specializationName,
              educationId,
              specializationId: item?.specializationId
            }
          });
          this.isSpecializationDataAvailable = true;
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

}
