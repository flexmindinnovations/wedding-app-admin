import { Injectable } from '@angular/core';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {

  endpoint = environment.endpoint + '/api/MembershipPlan';
  constructor(
    private http: HttpConfigService
  ) { }

  getSubscriptionPlansList(): Observable<any> {
    return this.http.get(`${this.endpoint}/getMembershipPlanList`);
  }

  getSubscriptionPlansById(planId:any): Observable<any> {
    return this.http.get(`${this.endpoint}/getMembershipPlanById?planId=${planId}`);
  }

  saveNewSubscriptionPlan(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/saveMembershipPlan`, payload);
  }

  updateSubscriptionPlan(payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/updateMembershipPlan`, payload);
  }

  deleteSubscriptionPlan(subscriptionPlanId: number): Observable<any> {
    return this.http.delete('');
  }
}
