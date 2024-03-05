import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeightService {

  endpoint = environment.endpoint + '/api/Cast';
  http = inject(HttpConfigService);

  getCastList(): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCastList`);
  }



}

