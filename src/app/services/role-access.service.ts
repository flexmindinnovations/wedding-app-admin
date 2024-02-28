import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {

  loadJson = inject(HttpClient);


  getRoleAccessData(): Observable<any> {
    return this.loadJson.get('../../assets/data/access-roles.json');
  }


}
