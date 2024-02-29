import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  endpoint = environment.endpoint + '/api/Branch';
  http = inject(HttpConfigService);

  addBranch(payload: any): Observable<any> {
    return this.http.postImage(`${this.endpoint}/UploadImageWithBranchData`, payload)
  }
}
