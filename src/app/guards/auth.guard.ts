import { Injectable } from '@angular/core';
import {
  
  CanActivate,
  Router,
  
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    public auth:AuthService
    ) {}
  canActivate(
    
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      // localStorage.getItem('authenticated' )
      if ( localStorage.getItem('user') || localStorage.getItem('token')) {
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
      // if(!localStorage.getItem('token') || !localStorage.getItem('user')){
      //   this.router.navigate([routes.login]);
      //   return false;
      // }
      // let token = this.auth.token;
      // let expiration = (JSON.parse(atob(token.split(".")[1]))).exp;
      // if(Math.floor((new Date().getTime())/1000) >= expiration){
      //   this.auth.logout();
      //   return false;
      // }
      // return true;
  }
}
