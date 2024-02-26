import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigService {

  http = inject(HttpClient);

  constructor() { }

  get(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getHeaders({ isImage: false }) })
  }

  post(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload, { headers: this.getHeaders({ isImage: false }) })
  }

  put(url: string, payload: any): Observable<any> {
    return this.http.put(url, payload, { headers: this.getHeaders({ isImage: false }) })
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url, { headers: this.getHeaders({ isImage: false }) })
  }

  postImage(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getHeaders({ isImage: true }) })
  }

  getHeaders({ isImage }: { isImage: boolean }): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': isImage ? 'multipart/form-data' : 'application/json'
    })
  }
}
