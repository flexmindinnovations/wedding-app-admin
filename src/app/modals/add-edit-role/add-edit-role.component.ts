import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { RoleAccessService } from 'src/app/services/role-access.service';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss'],
})
export class AddEditRoleComponent implements OnInit {

  @Input() data: any;

  formGroup!: FormGroup;
  modalControllerService = inject(ModalController);
  accessRolesDataService = inject(RoleAccessService);
  accessRoleData: any[] = [];

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getRoleAccessData();
    this.initFormGroup();
  }

  getRoleAccessData() {
    this.accessRolesDataService.getRoleAccessData().subscribe((data: any) => {
      console.log('data getRoleAccessData: ', data);
      this.accessRoleData = data;
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      roleName: ['', [Validators.required]],
      roleAccess: !['', [Validators.required]],
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
    console.log('event: ', event);
    if(event?.isCancel) {
      this.modalControllerService.dismiss();
    }

  }

}
