import { Component, Input, OnDestroy, inject } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { v4 as uuidv4 } from 'uuid';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnDestroy {

  alertService = inject(AlertService);
  messageService = inject(MessageService)
  alertType: AlertType = 1;
  alertMessage: string = '';
  showAlert: boolean = true;
  @Input() key = uuidv4();

  ngAfterViewInit(): void {
    this.alertService.getAlertMessage().subscribe((data: any) => {
      this.showAlert = true;
      this.alertMessage = data?.message;
      this.alertType = data?.type;
      this.showToast();
    });
  }

  showToast() {
    this.messageService.add({
      key: this.key,
      sticky: true,
      severity: this.getAlertType(),
      summary: this.getAlertType(),
      detail: this.alertMessage
    });

    setTimeout(() => {
      this.handleHideAlert();
    }, 3000)
  }

  handleHideAlert() {
    this.showAlert = false;
    this.messageService.clear();
  }

  ngOnDestroy(): void {
    this.alertService.alertSubject.unsubscribe();
  }

  getAlertType() {
    switch (this.alertType) {
      case AlertType.success:
        return 'Success';
      case AlertType.error:
        return 'Error';
      case AlertType.warning:
        return 'Warning';
    }
  }
}
