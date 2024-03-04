import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from './http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerRegistrationService {

  endpoint = environment.endpoint + '/api';
  http = inject(HttpConfigService);


  savePersonalInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerPersonalInfo/saveCustomerPersonalInfo', payload);
  }

  saveFamilyInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerFamilyInfo/saveCustomerFamilyInfo', payload);
  }

  saveContactInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerContactInfo/saveCustomerContactInfo', payload);
  }

  saveOtherInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerOtherInfo/saveCustomerOtherInfo', payload);
  }

  savePhotos(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerContactInfo/saveCustomerContactInfo', payload);
  }

}
