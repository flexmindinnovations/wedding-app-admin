import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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
  accessRoleData: any[] = [];
  hasSpecializationToggle = false;

  specilaizationList: any[] = [
    { id: 1, name: 'Specialization Name' }
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
      specializationName: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      console.log('val: ', val);

    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss();
    }
  }

  handleEducationStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.hasSpecializationToggle = value;
  }

  handleAddRowClick(event: any) {
    const maxId = this.specilaizationList.reduce((max, obj) => obj.id > max ? obj.id : max, this.specilaizationList[0].id);
    const newItem = { id: maxId + 1, name: 'Specialization Name' }
    this.specilaizationList.push(newItem);
  }

  handleRemoveRowClick(event: any) {
    this.specilaizationList.splice(event, 1);
  }

}
