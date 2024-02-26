import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigService {

  http = inject(HttpClient);

  constructor() { }

  get(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getHeaders({ isImage: false }) })
    .pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }

  post(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload, { headers: this.getHeaders({ isImage: false }) })
    .pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }

  put(url: string, payload: any): Observable<any> {
    return this.http.put(url, payload, { headers: this.getHeaders({ isImage: false }) })
    .pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url, { headers: this.getHeaders({ isImage: false }) })
    .pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }

  postImage(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload, { headers: this.getHeaders({ isImage: true }) })
    .pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }

  getHeaders({ isImage }: { isImage: boolean }): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': isImage ? 'multipart/form-data' : 'application/json'
    })
  }
}
