import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CastService } from 'src/app/services/cast/cast.service';

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


  // subCastList: any[] = [
  //   {
  //     subCastId: 3,
  //     subCastName: "Agarwal",
  //     castId: 3
  //   },
  //   {
  //     subCastId: 5,
  //     subCastName: "Agarwal2",
  //     castId: 3
  //   }
  // ];


  subCastList: any[] = [
    { id: 1, name: "Sub Cast", subCastName: '' }
  ];

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    const data = this.data?.data;
    console.log(data);
    this.isEditMode = data?.isEditMode;
    if (this.isEditMode) this.patchFormData();
  }


  patchFormData() {
    const modalData = this.data?.data?.rowData;
    this.castId = modalData?.castId;
    this.castService.getCastListById(this.castId).subscribe({
      next: (data: any) => {
        if (data) {
          data.map((datum: any) => {
            this.castName = datum.castName;
            this.hasSubCastToggle = datum?.hasSubcast;
            this.subCastList = datum?.subCastList;
            // this.subCastList = datum?.subCastList.map((item: any) => {
            //   item['name'] = 'Sub Cast';
            //   item['castId'] = item?.castId;
            //   item['subCastName'] = item?.subCastName;
            //   return item;

            // })
            // const newList = datum.subCastList.map((item: any) => {
            //   return { subCastId: item.subCastId, subCastName: item.subCastName, castId: item.subCastId }
            // })
            // this.subCastList = [...newList]
            // this.subCastList = datum.subCastList;
            console.log(this.subCastList)
          }

          );


          const props = {
            castName: this.castName,
            hasSubCast: this.hasSubCastToggle,
            subCastList: this.subCastList
          }
          console.log(props);
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
      castName: ['', [Validators.required]],
      hasSubCast: !['', [Validators.required]],
      subCastList: ['', [Validators.required]],
      subCastName: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      console.log('val: ', val);
    })

  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }


  // addNewCast() {
  //   let formVal = this.formGroup.value;
  //   formVal = { heightId: 0, heightName: `${formVal.feet} feet ${formVal.inch} inch` }
  //   this.accessHeightDataService.saveHeight(formVal).subscribe({
  //     next: (data: any) => {
  //       if (data) {
  //         this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
  //         this.modalControllerService.dismiss({ event: 'add' });
  //       }
  //     },
  //     error: (error) => {
  //       console.log('error: ', error);
  //       this.alert.setAlertMessage(error?.message, AlertType.error);
  //     }
  //   })
  // }

  // updateCast() {
  //   let formVal = this.formGroup.value;
  //   formVal = { heightId: this.heightId, heightName: `${formVal.feet} feet ${formVal.inch} inch` };
  //   this.accessHeightDataService.updateHeight(formVal).subscribe({
  //     next: (data: any) => {
  //       if (data) {
  //         this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
  //         this.modalControllerService.dismiss({ event: 'update' });
  //       }
  //     },
  //     error: (error) => {
  //       console.log('error: ', error);
  //       this.alert.setAlertMessage(error?.message, AlertType.error);
  //     }
  //   })
  // }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
      return;
    }

    if (this.castId > 0) this.updateCast();
    else this.addNewCast();

  }

  addNewCast() {
    let formVal: any = { ...this.formGroup.value, castId: 0 };
    formVal['subCastList'] = this.subCastList.map((item: any) => {
      const obj = {
        subCastId: 0,
        castId: 0,
        subCastName: item?.subCastName
      }
      return obj;
    });

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

  updateCast() {
    let formVal: any = { ...this.formGroup.value, castId: this.castId };
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

  handleSubCastStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.hasSubCastToggle = value;
  }


  handleAddRowClick(event: any) {
    const maxId = this.subCastList.reduce((max, obj) => obj.id > max ? obj.id : max, this.subCastList[0].id);
    const newItem = { id: maxId + 1, name: 'SubCast Name', subCastName: '' }
    this.subCastList.push(newItem);
  }

  handleRemoveRowClick(event: any) {
    this.subCastList.splice(event, 1);
  }


  handleInputValue(event: string, item: any) {
    item.subCastName = event;
  }


}
