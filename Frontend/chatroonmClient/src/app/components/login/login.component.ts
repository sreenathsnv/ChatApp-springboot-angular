import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private cookieService:CookieService,
    private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
     
      setTimeout(() => {
       
        let email = this.loginForm.get('email')?.value;
        let passwd = this.loginForm.get('password')?.value;
       
        this.authService.login(email,passwd)
        this.loginForm.reset()
        this.cookieService.set('user',email)
        this.router.navigate(['/home'])
        


        this.isLoading = false;
        
      }, 2000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
