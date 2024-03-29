import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable, Subject } from 'rxjs';
import { IBranch } from 'src/app/interfaces/IBranch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  endpoint = environment.endpoint + '/api/Branch';
  http = inject(HttpConfigService);

  isRequestCompleted = new Subject<any>();
  isRequest = new Subject<any>();

  addBranch(payload: any): Observable<any> {
    return this.http.postImage(`${this.endpoint}/UploadImageWithBranchData`, payload)
  }

  getBranchList(): Observable<IBranch[]> {
    return this.http.get(`${this.endpoint}/GetBranchList`);
  }

  setRequestStatus(status: boolean, action: string) {
    this.isRequestCompleted.next({ status, action });
  }

  getRequestStatus(): Observable<any> {
    return this.isRequestCompleted.asObservable();
  }


  getBranchByBranchId(branchId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/GetBranchById?branchId=${branchId}`);
  }

  updateBranch(payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/UpdateBranchDataWithUploadImage`, payload);
  }

  deleteBranchById(branchId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/Delete/${branchId}`);
  }

  setUpdate(isCompleted: boolean): void {
    this.isRequest.next(isCompleted);
  }

  getUpdate(): Observable<any> {
    return this.isRequest.asObservable();
  }
}
