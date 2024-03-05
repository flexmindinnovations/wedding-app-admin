import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CastService {

  endpoint = environment.endpoint + '/api/Cast';
  http = inject(HttpConfigService);

  getCastList(): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCastList`);
  }
  getCastListById(payload: any): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCastListById`, payload)
  }
  getSubCastListByCast(payload: any): Observable<any> {
    return this.http.get(`${this.endpoint}/GetSubCastListByCastId`, payload)
  }
}

