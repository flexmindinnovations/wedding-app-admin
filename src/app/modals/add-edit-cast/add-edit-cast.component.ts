import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CastService } from 'src/app/services/cast/cast.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-edit-cast',
  templateUrl: './add-edit-cast.component.html',
  styleUrls: ['./add-edit-cast.component.scss'],
})
export class AddEditCastComponent implements OnInit {
  @Input() data: any;
  isEditMode: boolean = false;
  formGroup: any;
  modalControllerService = inject(ModalController);
  hasSubCastToggle = false;
  alert = inject(AlertService);
  castService = inject(CastService)
  castId = 0;
  castName: string = '';
  subCastFormGroup!: FormArray;
  sharedService = inject(SharedService)
  cdref = inject(ChangeDetectorRef);
  religionListOptions: any[] = [];
  religionId: any;

  subCastList: any[] = [
    { id: 1, name: "Sub Cast", subCastName: '' },
  ];
  alreadyCastList: any;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getReligionList();
    const data = this.data?.data;
    this.isEditMode = data?.isEditMode;
    this.alreadyCastList = data?.alreadyCastList;
    if (this.isEditMode) this.patchFormData();
  }

  patchFormData() {
    const modalData = this.data?.data?.rowData;
    this.castId = modalData?.castId;
    const subCastList = this.formGroup.get('subCastList') as FormArray;
    subCastList.clear();
    this.castService.getCastListById(this.castId).subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          this.hasSubCastToggle = data?.hasSubcast;
          this.castName = data?.castName;
          this.religionId = data?.religionId;
          this.subCastList = data.subCastList.map((item: any) => {
            item['name'] = 'Sub Cast';
            item['castId'] = this.castId;
            return item;
          });

          const props = {
            hasSubCast: this.hasSubCastToggle,
            castName: this.castName,
            religionId: this.religionId
          }
          this.formGroup.patchValue(props);
          this.subCastList.forEach((subCast: any) => {
            // console.log('subCast: ', subCast);

            subCastList.push(
              this.fb.group({
                subCastName: subCast?.subCastName ? subCast.subCastName : ''
              })
            )
          })
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      religionId: ['', [Validators.required]],
      castName: ['', [Validators.required]],
      hasSubCast: !['', [Validators.required]],
      subCastList: this.fb.array([]),
    })

    const subCastArray = this.formGroup.get('subCastList') as FormArray;
    const newSubCastGroup = this.fb.group({
      subCastName: ['']
    });
    subCastArray.push(newSubCastGroup);
    this.subCastFormGroup = subCastArray;

  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  get subCastListGroup(): FormArray {
    return this.formGroup.get('subCastList') as FormArray;
  }


  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
      return;
    }

    if (this.castId > 0) this.updateCast();
    else this.addNewCast();

  }

  addNewCast() {
    let formVal: any = { ...this.formGroup.value, castId: 0, religionId: this.religionId };
    formVal['subCastList'] = this.subCastList.map((item: any) => {
      const obj = {
        subCastId: 0,
        castId: 0,
        subCastName: item?.subCastName
      }
      return obj;
    });
    if (this.alreadyCastList.includes(formVal.castName.toLowerCase().trim())) {
      this.alert.setAlertMessage(`${formVal.castName} Already exists`, AlertType.warning);
    }
    else {
      this.castService.addNewCast(formVal).subscribe({
        next: (data: any) => {
          if (data) {
            this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
            this.modalControllerService.dismiss({ event: 'add' });
          }
        },
        error: (error) => {
          this.alert.setAlertMessage(error?.message, AlertType.error);
        }
      })
    }
  }

  updateCast() {
    let formVal: any = { ...this.formGroup.value, castId: this.castId, religionId: this.religionId };
    formVal['subCastList'] = this.subCastList.map((item: any) => {
      return {
        subCastId: item.subCastId ? item.subCastId : 0,
        castId: this.castId ? this.castId : 0,
        subCastName: item?.subCastName
      }
    });
    this.castService.updateNewCast(formVal, this.castId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'update' });
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }


  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

  onSelectionChange(event: any, src: string) {
    const religionId = event?.id;
    this.religionId = religionId;
  }

  handleSubCastStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.hasSubCastToggle = value;
  }


  handleAddRowClick(event: any) {
    const maxId = this.subCastList.reduce((max, obj) => obj.id > max ? obj.id : max, this.subCastList[0].id);
    const newItem = { id: maxId + 1, name: 'Sub Cast', subCastName: '' }
    this.subCastList.push(newItem);
    const subCastListGroup = this.formGroup.get('subCastList') as FormArray;
    const subCastGroup = this.fb.group({
      subCastName: [''],
    });
    subCastListGroup.push(subCastGroup);
    this.subCastFormGroup = subCastListGroup;
  }

  handleRemoveRowClick(event: any) {
    this.subCastList.splice(event, 1);
    this.subCastFormGroup.controls.splice(event, 1);
  }


  handleInputValue(event: string, item: any, index: number) {
    item.subCastName = event;
    const control = item?.get('subCastName');
    if (control) control.setValue(event);
    this.subCastList[index].subCastName = event;
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

}
