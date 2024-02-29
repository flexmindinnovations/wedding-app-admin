import { Component, OnInit, inject } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {

  alertService = inject(AlertService);
  alertType: AlertType = 1;
  alertMessage: string = '';
  alertId: string = '';

  ngOnInit() {
    this.alertService.getAlertMessage().subscribe((alert: any) => {
      console.log('alert: ', alert);
      this.alertType = alert?.type;
      this.alertMessage = alert?.message;
      this.alertId = `alert-${this.alertType}`;
    })
  }

}
