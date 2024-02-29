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
  endpoint = environment.endpoint + '/api';


  getEducationList(): Observable<IEducation[]> {
    return this.http.get(`${this.endpoint}/Education/GetEducationList`);
  }

  getEducationSpecializationList(): Observable<IEducation[]> {
    return this.http.get(`${this.endpoint}/Specialization/GetSpecializationList`);
  }

  getEducationSpecializationListByEducationId(educationId?: number): Observable<IEducation[]> {
    return this.http.get(`${this.endpoint}/GetEducationList`);
  }

  addNewCourse(payload: IEducation): Observable<IEducation> {
    return this.http.post(`${this.endpoint}/SaveEducation`, payload);
  }
}
