import { Injectable, inject } from '@angular/core';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';
import { IEducation } from 'src/app/interfaces/IEducation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  http = inject(HttpConfigService);
  endpoint = environment.endpoint + '/api/Education';


  getEducationList(): Observable<IEducation[]> {
    return this.http.get(`${this.endpoint}/GetEducationList`);
  }

  getEducationSpecializationList(educationId: number): Observable<IEducation[]> {
    return this.http.get(`${this.endpoint}/GetEducationList`);
  }
}
