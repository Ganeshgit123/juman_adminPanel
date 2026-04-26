import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = environment.baseUrl;
  // s3Endpoint = environment.s3Url;
  accToken = sessionStorage.getItem('access_token');

  headers = new HttpHeaders()
    // .set('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Credentials', 'true')
    // .set('language', 'es');
  constructor(private http: HttpClient, private router: Router) { }

  // s3upload(user: any): Observable<any> {
  //   const apis3 = `http://13.55.52.81:8080/api/v1/users/upload`;
  //   return this.http.post(apis3, user).pipe(catchError(this.handleError));
  // }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 401 || error.status === 403) {
        // this.injector.get(UserService).purgeAuth();
        // this.injector.get(ToasterService).showError(`Unauthorized`, errorMsg);
        // this.injector.get(Router).navigateByUrl(`/login`);
        this.router.navigate(['/login']);
        console.log('errorthrows');
      }

      console.log('error', msg);
    }
    return throwError(msg);
  }

  // s3upload(user: any) {

  //   return this.http
  //     .post<any>(`${this.s3Endpoint}/upload`, user);
  // }

  signIn(user: any) {
    return this.http
      .post<any>(`${this.endpoint}/user/login`, user);
  }
  getToken() {
    return sessionStorage.getItem('access_token');
  }

  doLogout(): Observable<any> {
    const param1 = new HttpParams()
    return this.http.get<any>(`${this.endpoint}/logout`,
      { params: param1 });
  }

  getHeader(data): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/header/query`,data);
  }

  updateHeader(data){
    return this.http.post<any>(`${this.endpoint}/header`, data)
  }

  getBanners(data){
    return this.http.post<any>(`${this.endpoint}/banners/query`,data);
  }

  createBanner(data){
    return this.http.post<any>(`${this.endpoint}/banners/upload`, data);
  }

  updateBanner(data){
    return this.http.post<any>(`${this.endpoint}/banners/upload`, data);
  }

  updateBannerWithoutImg(data){
    return this.http.post<any>(`${this.endpoint}/banners`, data);
  }

  uploadImage(data){
    return this.http.post<any>(`${this.endpoint}/sections/images/upload`, data);
  }

  updateImages(data){
    return this.http.post<any>(`${this.endpoint}/sections/images/upload`, data)
  }

  updateImagesWithoutUpload(data){
    return this.http.put<any>(`${this.endpoint}/sections/images/update`, data)
  }

  getSectionBySectionid(data){
    return this.http.get<any>(`${this.endpoint}/sections/${data}`);
  }

  getSectionsByHeaderId(data){
    return this.http.post<any>(`${this.endpoint}/sections/query`,data);
  }

  updateSection(data){
    return this.http.post<any>(`${this.endpoint}/sections`, data)
  }

  createSection(data){
    return this.http.post<any>(`${this.endpoint}/sections`, data)
  }

  getImagesBySectionId(data){
    return this.http.post<any>(`${this.endpoint}/sections/images/list`,data);
  }

  getFooter(data){
    return this.http.post<any>(`${this.endpoint}/footer/query`,data);
  }

  updateFooter(data){
    return this.http.post<any>(`${this.endpoint}/footer`, data)
  }
  
  getContacts(data){
    return this.http.post<any>(`${this.endpoint}/contacts/list`,data);
  }

  getCarrer(data){
    return this.http.post<any>(`${this.endpoint}/career/list`,data);
  }

}


