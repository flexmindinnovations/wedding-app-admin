import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBranch } from '../interfaces/IBranch';
import { HttpConfigService } from './http-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  endpoint = environment.endpoint + '/api';
  permissionListMap = new Map<string, any>();
  userPermissions = new Subject();
  http = inject(HttpConfigService);
  httpAssests = inject(HttpClient);
  showAlert = new Subject();
  controlRest = new Subject();
  logoutCall = new Subject();
  imagesSelected = new Subject();

  isLoggedIn = new Subject();

  getIsLoggedIn(): Observable<any> {
    return this.isLoggedIn.asObservable();
  }

  getImagesSelected(): Observable<any> {
    return this.imagesSelected.asObservable();
  }

  getLogoutEvent() {
    return this.logoutCall.asObservable();
  }

  showAlertEvent() {
    return this.showAlert.asObservable();
  }

  resetControl() {
    return this.controlRest.asObservable();
  }

  setUserPermissions(permissionList: any) {
    this.userPermissions.next(permissionList);
  }

  getUserPermissions(): Observable<any> {
    return this.userPermissions.asObservable();
  }

  getDashboardItems(): Observable<any> {
    return this.httpAssests.get('../../assets/data/dashboard-items.json')
  }

  getCountryList(): Observable<IBranch[]> {
    return this.http.get(`${this.endpoint}/Country/GetCountries`);
  }
  getStatByCountry(countryId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/State/getStateListCountryIdWise?countyId=${countryId}`)
  }

  getCityByState(stateId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/City/getCityListStateIdWise?stateId=${stateId}`)
  }

  getHandyCapItemList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Handycap/GetHandycapList`);
  }

  getBloodGroupList(): Observable<any> {
    return this.http.get(`${this.endpoint}/BloodGroup/GetBloodGroupList`);
  }

  getFoodPreferencesList(): Observable<any> {
    return this.http.get(`${this.endpoint}/FoodPreferences/getFoodPreferencesList`);
  }

  getOccupationList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Occupation/getOccupationList`);
  }
  getOccupationById(occupationId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/Occupation/getOccupationById?occupationId=${occupationId}`);
  }
  getMotherTongueList(): Observable<any> {
    return this.http.get(`${this.endpoint}/MotherTongue/getMotherTongueList`);
  }

  getUserByUserId(userId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/User/getUserByUserId?userId=${userId}`);
  }


  getDashboardCountList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Dashboard/getCountData`);
  }

  getReligionList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Religion/getReligionList`);
  }


}
