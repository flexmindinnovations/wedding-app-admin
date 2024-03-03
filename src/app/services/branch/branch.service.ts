import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';
import { IBranch } from 'src/app/interfaces/IBranch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  endpoint = environment.endpoint + '/api/Branch';
  http = inject(HttpConfigService);

  addBranch(payload: any): Observable<any> {
    return this.http.postImage(`${this.endpoint}/UploadImageWithBranchData`, payload)
  }

  getBranchList(): Observable<IBranch[]> {
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
