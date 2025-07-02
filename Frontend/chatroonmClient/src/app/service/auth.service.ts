import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { SignUp } from '../models/sign-up.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  isLoggedIn:boolean;
  isLoggedInSubject:BehaviorSubject<boolean>;
  isLoggedInObservable:Observable<boolean>;
  private TOKEN: string="auth-token";


  constructor(
    private http:HttpClient,
    private cookieService:CookieService,
    private router:Router) { 


      const initialStatus:boolean = this.isAuthenticated();
      this.isLoggedIn = initialStatus;
      this.isLoggedInSubject = new BehaviorSubject<boolean>(initialStatus);
      this.isLoggedInObservable = this.isLoggedInSubject.asObservable();
    }

  login(email:string, passwd:string){

    this.http.post(`${environment.apiURL}/auth/authenticate`,{
      userEmail:email,
      password:passwd
    }

    ).subscribe(
     {
      next: (response:any)=>{
        this.isLoggedIn=true;
        this.isLoggedInSubject.next(true);
        this.cookieService.set(this.TOKEN,response.token,{
          expires:1,
          path:'/',
          secure:true,
          sameSite:'Strict'
        })
        
      },
      error:(e)=>{console.log(e)}
     }
    )
  }

  signup(signup:SignUp){

    this.http.post(`${environment.apiURL}/auth/register`,signup.toObject()).subscribe(
      {
        next:(resp)=>{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: signup.username+' has been registered successfully',
            showConfirmButton: false,
            timer: 1500
          });

          this.router.navigate(['/login'])
        }
      }
    )
  }

  logout():void{

    this.cookieService.delete(this.TOKEN)
    this.isLoggedIn=false
    this.isLoggedInSubject.next(false)
  }

  isAuthenticated():boolean{

    return (this.isLoggedIn || this.cookieService.check(this.TOKEN))

  }


  getToken():string{

    return this.cookieService.get(this.TOKEN);
  }
}
