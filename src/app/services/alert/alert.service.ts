import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertSubject = new Subject<any>();

  setAlertMessage(message: string, type: AlertType): void {
    console.log('setAlertMessage: ', {message, type});
    
    this.alertSubject.next({ message, type });
  }

  getAlertMessage(): Observable<any> {
    return this.alertSubject.asObservable();
  }
}
