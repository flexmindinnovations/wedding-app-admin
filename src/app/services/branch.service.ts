import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  endpoint = environment.endpoint + '/api/Branch';
  http = inject(HttpClient);

  constructor() { }

  getBranchList(): Observable<any> {
    return this.http.get(`${this.endpoint}/GetBranchList`);
  }

  addNewBranch(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/Post`, payload);
  }

  updateNewBranch(payload: any, branchId: number): Observable<any> {
    return this.http.put(`${this.endpoint}/Post/${branchId}`, payload);
  }

  getBranchId(branchId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/Get/${branchId}`);
  }

  deleteBranchById(branchId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/Delete/${branchId}`);
  }
}
