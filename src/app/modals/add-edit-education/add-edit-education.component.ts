import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { ISpecialization } from 'src/app/interfaces/IEducation';
import { AlertService } from 'src/app/services/alert/alert.service';
import { EducationService } from 'src/app/services/education/education.service';
import { RoleAccessService } from 'src/app/services/role-access.service';

@Component({
  selector: 'app-add-edit-education',
  templateUrl: './add-edit-education.component.html',
  styleUrls: ['./add-edit-education.component.scss'],
})
export class AddEditEducationComponent implements OnInit, OnDestroy {

  @Input() data: any;
  isEditMode: boolean = false;

  formGroup!: FormGroup;
  modalControllerService = inject(ModalController);
  accessRolesDataService = inject(RoleAccessService);
  educationService = inject(EducationService);
  alert = inject(AlertService);
  accessRoleData: any[] = [];
  hasSpecializationToggle = false;
  educationId = 0;

  specilaizationList: any[] = [
    { id: 1, name: 'Specialization Name', specializationName: '' }
  ];

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    console.log('data: ', this.data);
    const data = this.data?.data;
    this.isEditMode = data?.isEditMode;
    if (this.isEditMode) this.patchFormData();
  }

  patchFormData() {
    const modalData = this.data?.data?.rowData;
    console.log('modalData: ', modalData);
    this.educationId = modalData?.educationId;
    this.hasSpecializationToggle = modalData?.hasSpecialization;
    this.educationService.getSpecializationListByEducationId(modalData?.educationId).subscribe({
      next: (data: any) => {
        if (data) {
          this.specilaizationList = data.map((item: any) => {
            item['name'] = 'Specialization Name';
            return item;
          });
          const props = {
            hasSpecialization: this.hasSpecializationToggle,
            educationName: modalData?.educationName,
            specializationList: this.specilaizationList
          }
          this.formGroup.patchValue(props);
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      hasSpecialization: !['', [Validators.required]],
      educationName: ['', [Validators.required]],
      specializationList: ['', [Validators.required]],
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }


  handleInputValue(event: string, item: any) {
    item.specializationName = event;
  }

  handleButtonClick(event: any) {
    console.log('event: ', event);
    console.log('educationId: ', this.educationId);

    if (event?.isCancel) {
      this.modalControllerService.dismiss();
      return;
    }

    if (this.educationId > 0) this.updateCourseDetails();
    else this.addNewCourse();
  }

  addNewCourse() {
    let formVal: any = { ...this.formGroup.value, educationId: 0 };
    formVal['specializationList'] = this.specilaizationList.map((item: any) => {
      const obj = {
        specializationId: 0,
        educationId: 0,
        specializationName: item?.specializationName
      }
      return obj;
    });

    this.educationService.addNewCourse(formVal).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss();
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  updateCourseDetails() {
    let formVal: any = { ...this.formGroup.value, educationId: this.educationId };
    formVal['specializationList'] = this.specilaizationList.map((item: any) => {
      const obj = {
        specializationId: 0,
        educationId: 0,
        specializationName: item?.specializationName
      }
      return obj;
    });
    this.educationService.updateCourse(formVal).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss();
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  handleEducationStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.hasSpecializationToggle = value;
  }

  handleAddRowClick(event: any) {
    const maxId = this.specilaizationList.reduce((max, obj) => obj.id > max ? obj.id : max, this.specilaizationList[0].id);
    const newItem = { id: maxId + 1, name: 'Specialization Name', specializationName: '' }
    this.specilaizationList.push(newItem);
  }

  handleRemoveRowClick(event: any) {
    this.specilaizationList.splice(event, 1);
  }

  ngOnDestroy() {
    this.specilaizationList = [];
  }

}
