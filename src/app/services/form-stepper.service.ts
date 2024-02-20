import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SideBarItem } from '../interfaces/sidebar';

@Injectable({
  providedIn: 'root'
})
export class FormStepperService {

  http = inject(HttpClient);

  getFormStepperItems(): Observable<SideBarItem[]> {
    return this.http.get<SideBarItem[]>('../../assets/data/stepper-form-items.json');
  }
}
