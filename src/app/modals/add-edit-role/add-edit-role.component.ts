import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { retry } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { RoleAccessService } from 'src/app/services/role-access.service';
import { RolesService } from 'src/app/services/role/roles.service';

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
  roleService = inject(RolesService);
  roleObj: any;
  roleId = 0;
  alert: any;

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
      this.accessRoleData = data;
    })
  }

  getRoleList() {
    const roleList = this.accessRoleData.filter(role => role.enabled);
    this.roleObj = {
      roleId: this.roleId,
      roleName: this.formGroup.get('roleName')?.value,
      permissionList: roleList.map((role, index) => {
        const obj = {
          permissionId: 0,
          moduleId: 0,
          roleId: role?.id,
          canAdd: role?.actions[0].enabled,
          canEdit: role?.actions[1].enabled,
          canDelete: role?.actions[2].enabled
        }
        return obj;
      })
    }
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
    if (event?.isCancel) {
      this.modalControllerService.dismiss();
    }


    if (this.roleId > 0) this.updateRole();
    else this.addNewRole();

  }

  updateRole() {
    this.roleService.updateRole(this.roleObj).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'add' });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  addNewRole() {
    this.roleService.saveRole(this.roleObj).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'add' });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  handleParentStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    // this.accessRoleData.forEach((role) => role.enabled = false);
    item.enabled = value;
    item.actions.forEach((action: any) => action.enabled = value);
    this.getRoleList();
  }

  handleChildStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    item.enabled = value;
    // console.log('accessRoleData: ', this.accessRoleData);
    this.getRoleList();
  }

}
