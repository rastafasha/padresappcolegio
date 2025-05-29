import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  public user!: Student;
      public recientes!: Student;
      public identity!: Student;
      // public role: Role;
      error!:string;
    
      serverUrl = environment.url_servicios;
    
      constructor(
        private http: HttpClient,
        private router: Router,
        public authService: AuthService,
        ) {
        this.user;
      }
    
    
      get token():string{
        return localStorage.getItem('auth_token') || '';
      }
    
      get role(): 'SUPERADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST' {
        return this.user.role!;
      }
    
    
      get headers(){
        return{
          headers: {
            'auth_token': this.token
    
          }
        }
    
      }
    
      getAll(): Observable<any> {
    
        let headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
        let URL = this.serverUrl+"/students";
        return this.http.get(URL, {headers:headers});
    
        
      }
     
      getUserById(id:number): Observable<any> {
    
        let headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
        let URL = this.serverUrl+"/student/show/"+id;
        return this.http.get(URL,{headers:headers});
      }
      getPaymentById(id:number): Observable<any> {
    
        let headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
        let URL = this.serverUrl+"/student/paymentbyid/"+id;
        return this.http.get(URL,{headers:headers});
      }
      getByParentId(id:number): Observable<any> {
    
        let headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
        let URL = this.serverUrl+"/student/byparent/"+id;
        return this.http.get(URL,{headers:headers});
      }
    
    
      update(data: any) {
        const url = `${baseUrl}/student/update/${data.id}`;
        return this.http.put(url, data, this.headers);
      }
    
      deleteById(user:Student): Observable<any> {
        const url = `${baseUrl}/student/destroy/${user}`;
        return this.http.delete(url, this.headers)
      }
  
      search(query=''){
      return this.http.get(`${baseUrl}/student/search/buscar`, {params: {buscar: query}})
  
    }
}
