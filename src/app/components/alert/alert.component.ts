import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Dismiss } from "flowbite";
import type { DismissOptions, DismissInterface } from "flowbite";
import type { InstanceOptions } from 'flowbite';
import { AUTO_DISMISS_TIMER } from 'src/util/util';
import { IAlert } from 'src/app/interfaces/IAlert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements AfterViewInit, OnDestroy {

  alertService = inject(AlertService);
  alertType: AlertType = 1;
  alertMessage: string = '';
  alertMessages: string[] = [];
  alertId: string = '';

  alertSubscription: Subscription | null = null;


  ngAfterViewInit() {
    this.alertSubscription = this.alertService.getAlertMessage().subscribe((alert: IAlert) => {
      const alertEl = document.getElementById('alertContainer');
      alertEl?.classList.add('show');
      this.alertType = alert?.type;
      this.alertMessage = alert?.message;
      this.alertId = `alert-${this.alertType}`;
      this.autoHideAlert();
    })
  }

  autoHideAlert() {
    setTimeout(() => {
      const alertEl = document.getElementById('alertContainer');
      alertEl?.classList.remove('show');
    }, AUTO_DISMISS_TIMER);
  }

  handleHideAlert() {
    const alertEl = document.getElementById('alertContainer');
    alertEl?.classList.toggle('show');
  }

  ngOnDestroy(): void {
    this.alertSubscription?.unsubscribe();
  }

}
