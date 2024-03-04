import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { EducationService } from 'src/app/services/education/education.service';
import { HeightService } from 'src/app/services/height/height.service';
import { findInvalidControlsRecursive, getRandomNumber } from 'src/util/util';

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {

  formGroup!: FormGroup;
  genderOptions: any = [];
  maritalStatusOptions: any = [];
  educationListOptions: any = [];
  heightListOptions: any = [];
  physicalStatusListOptions: any = [];
  specializationListOptions: any = [];
  @ViewChild('dropdownInput') dropdownInput: any;

  @Output() personalInfoData = new EventEmitter();
  educationService = inject(EducationService);
  heightService = inject(HeightService);
  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);

  hasSpecialization: boolean = false;
  isOtherPhyicalCondition: boolean = false;

  specializationId = '';
  isDataAvailable = false;
  isSpecializationDataAvailable = false;
  constructor(
    private fb: FormBuilder
  ) {
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

  initFormGroup() {
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      // mobileNo: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      heightId: ['', [Validators.required]],
      eduationId: ['', [Validators.required]],
      specializationId: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      physicalStatus: ['', [Validators.required]],
      otherPhysicalCondition: ['', ![Validators.required]],
      maritalStatus: ['', [Validators.required]],
      hobbies: ['', ![Validators.required]]
    });
    this.patchValue();
  }

  patchValue() {
    this.physicalStatusListOptions = [
      { id: 1, title: 'Handicapped' },
      { id: 2, title: 'Blind' },
      { id: 3, title: 'Deaf-mute/dumb' },
      { id: 4, title: 'Mentally retarded /Retard' },
      { id: 5, title: 'Psycho' },
      { id: 6, title: 'Wheelchair bound' },
      { id: 7, title: 'Other' },
    ];

    this.formGroup.patchValue(
      {
        firstName: 'Mohammed',
        lastName: 'Ali',
        middleName: 'Mohammed',
        gender: 'male',
        heightId: 5,
        eduationId: 5,
        specializationId: 8,
        dateOfBirth: new Date(),
        occupation: 'Self Employed',
        physicalStatus: 7,
        otherPhysicalCondition: 'Test',
        maritalStatus: 'married',
        hobbies: 'Test'
      }
    )
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    const formVal = this.formGroup.value;
    formVal['specializationId'] = this.specializationId ? this.specializationId : '';
    formVal['dateOfBirth'] = new Date(formVal['dateOfBirth']);
    if (this.formGroup.valid) {
      this.customerRegistrationService.savePersonalInformation(formVal).subscribe({
        next: (data: any) => {
          if (data) {
            const props: FormStep = {
              source: src,
              data: {...formVal, customerId: data?.id},
              formId: 1,
              action: ActionValue.next,
              isCompleted: data?.status 
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
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }

  getMasterData() {
    const education = this.educationService.getEducationList();
    const height = this.heightService.getHeightList();
    forkJoin({ education, height })
      .subscribe({
        next: async (result) => {
          this.isDataAvailable = true;
          const { education, height } = result;
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
