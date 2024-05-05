import { Injectable } from '@angular/core';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {

  constructor(
    private http: HttpConfigService
  ) { }

  getSubscriptionPlansList(): Observable<any> {
    return this.http.get('');
  }

  saveNewSubscriptionPlan(payload: any): Observable<any> {
    return this.http.post('', payload);
  }

  updateSubscriptionPlan(payload: any, subscriptionPlanId: number): Observable<any> {
    return this.http.put('', payload);
  }

  deleteSubscriptionPlan(subscriptionPlanId: number): Observable<any> {
    return this.http.delete('');
  }
}
