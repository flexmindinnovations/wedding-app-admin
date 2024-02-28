import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBranch } from '../interfaces/IBranch';
import { HttpConfigService } from './http-config.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  endpoint = environment.endpoint + '/api';
  http = inject(HttpConfigService);

  getCountryList(): Observable<IBranch[]> {
    return this.http.get(`${this.endpoint}/Country/GetCountries`);
  }
  getStatByCountry(countryId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/State/getStateListCountryIdWise?countyId=${countryId}`)
  }

  getCityByState(stateId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/City/getCityListStateIdWise?stateId=${stateId}`)
  }


}
