import { Component, OnInit, inject } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Dismiss } from "flowbite";
import type { DismissOptions, DismissInterface } from "flowbite";
import type { InstanceOptions } from 'flowbite';
import { AUTO_DISMISS_TIMER } from 'src/util/util';

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
      this.alertType = alert?.type;
      this.alertMessage = alert?.message;
      this.alertId = `alert-${this.alertType}`;

      setTimeout(() => {
        this.autoHideAlert();
      }, AUTO_DISMISS_TIMER);
    })
  }

  autoHideAlert() {
    const alertEl = document.getElementById('alertContainer');
    alertEl?.classList.toggle('show');
  }

  handleHideAlert() {
    const alertEl = document.getElementById('alertContainer');
    alertEl?.classList.toggle('show');
  }

}
