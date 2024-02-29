import { Component, Input, OnInit, inject } from '@angular/core';
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
export class AddEditEducationComponent implements OnInit {

  @Input() data: any;

  formGroup!: FormGroup;
  modalControllerService = inject(ModalController);
  accessRolesDataService = inject(RoleAccessService);
  educationService = inject(EducationService);
  alert = inject(AlertService);
  accessRoleData: any[] = [];
  hasSpecializationToggle = false;

  specilaizationList: any[] = [
    { id: 1, name: 'Specialization Name', value: '' }
  ];

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
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
    item.value = event;
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss();
      return;
    }

    let formVal: any = { ...this.formGroup.value, educationId: 0 };
    formVal['specializationList'] = this.specilaizationList.map((item: any) => {
      const obj = {
        specializationId: 0,
        educationId: 0,
        specializationName: item?.value
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

  handleEducationStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.hasSpecializationToggle = value;
  }

  handleAddRowClick(event: any) {
    const maxId = this.specilaizationList.reduce((max, obj) => obj.id > max ? obj.id : max, this.specilaizationList[0].id);
    const newItem = { id: maxId + 1, name: 'Specialization Name', value: '' }
    this.specilaizationList.push(newItem);
  }

  handleRemoveRowClick(event: any) {
    this.specilaizationList.splice(event, 1);
  }

}
