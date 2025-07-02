import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUp } from '../../models/sign-up.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio:'',
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]],
      newsletter: [false]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrength(): number {
    const password = this.signupForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    return strength;
  }

  getPasswordStrengthClass(index: number): string {
    const strength = this.getPasswordStrength();
    if (index < strength) {
      switch (strength) {
        case 1: return 'bg-red-500';
        case 2: return 'bg-yellow-500';
        case 3: return 'bg-blue-500';
        case 4: return 'bg-green-500';
        default: return 'bg-gray-200';
      }
    }
    return 'bg-gray-200';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {

        let email:string = this.signupForm.get('email')?.value;
        let password:string = this.signupForm.get('password')?.value;
        let firstname:string = this.signupForm.get('firstName')?.value;
        let lastname:string = this.signupForm.get('lastName')?.value;
        let bio:string = this.signupForm.get('bio')?.value;
    
        const username = (firstname.toLowerCase().split(' ').join('_'))+lastname.toLowerCase().split(' ').join('_')

       console.log(email,password,firstname,lastname,bio)
        const signupData = new SignUp(email,username,password,bio);
        
        this.authService.signup(signupData)
        

        this.isLoading = false;
        
      }, 2000);

    
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  
}
