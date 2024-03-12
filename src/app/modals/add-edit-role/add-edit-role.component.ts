import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { debounceTime, forkJoin, of } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
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
  alert = inject(AlertService);
  existingRoles: any[] = [];
  isRoleExists: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getRoleAccessData();
    this.initFormGroup();
  }

  getRoleAccessData() {
    const moduleList = this.accessRolesDataService.getModuleList();
    const roleList = this.accessRolesDataService.getRoleList();
    forkJoin({ moduleList, roleList }).subscribe({
      next: (response: any) => {
        if (response) {
          const { moduleList, roleList } = response;
          this.existingRoles = roleList;
          console.log('roleList: ', roleList);

          if (moduleList?.length) {
            const moduleListMapper = moduleList.map((item: any) => {
              return {
                "id": item?.moduleId,
                "moduleName": item?.moduleName,
                "enabled": false,
                "actions": [
                  { "action": "Can Add", "enabled": false },
                  { "action": "Can Edit", "enabled": false },
                  { "action": "Can Delete", "enabled": false }
                ]
              }
            })
            console.log('moduleListMapper: ', moduleListMapper);
            this.accessRoleData = moduleListMapper;
          }
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      roleName: ['', [Validators.required]],
      roleAccess: !['', [Validators.required]],
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleInputChange(event: string) {
    of(event)
      .pipe(
        debounceTime(2000),
      ).subscribe((val: any) => {
        this.isRoleExists = this.isRoleNameExists(val);
        if (this.isRoleExists) {
          this.formGroup.get('roleName')?.setErrors({ 'alreadytExists': '' });
        }
      })
  }

  isRoleNameExists(roleName: string): boolean {
    return this.existingRoles.some((item: any) => item.roleName === roleName);
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss();
      return;
    }

    const rolePayload = {
      roleId: 0,
      roleName: this.formGroup.get('roleName')?.value,
      permissionList: this.getPermissionList(0)
    };
    console.log('rolePayload: ', rolePayload);

    // console.log('accessRoleData: ', this.accessRoleData);


  }

  getPermissionList(roleId: number) {
    const permissionList = this.accessRoleData.map((item: any) => {
      const canAdd = item.actions.filter((access: any) => access.action.replace(' ', '').toLowerCase() === 'canadd')[0].enabled;
      const canEdit = item.actions.filter((access: any) => access.action.replace(' ', '').toLowerCase() === 'canedit')[0].enabled;
      const canDelete = item.actions.filter((access: any) => access.action.replace(' ', '').toLowerCase() === 'candelete')[0].enabled;
      return {
        permissionId: 0,
        moduleId: item?.id,
        moduleName: item?.moduleName,
        roleId,
        canView: item.enabled,
        canAdd,
        canEdit,
        canDelete
      }
    })

    return permissionList;
  }

  handleParentStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    // this.accessRoleData.forEach((role) => role.enabled = false);
    item.enabled = value;
    item.actions.forEach((action: any) => action.enabled = value);
  }

  handleChildStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    item.enabled = value;
    // console.log('accessRoleData: ', this.accessRoleData);
  }

}
