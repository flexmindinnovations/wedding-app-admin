import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { COLOR_SCHEME } from 'src/util/util';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;

  formGroup!: FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.isLoading = true;
    this.setCurrentClass();
    this.initFormGroup();
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.isLoggedIn = true;
      of(true).pipe(
        delay(2000),
        tap(() => {
          this.router.navigateByUrl('/');
        })
      ).subscribe();
    } else {
      this.isLoggedIn = false;
      this.isLoading = false;
    }
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    // this.colorVarients = buttonThemeVariables[this.colorScheme][this.size];
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleSignIn() {
    this.isLoading = true;
    const formInput = this.formGroup.value;
    if (!this.formGroup.valid) return;
    if (formInput.username === 'admin' && formInput.password === 'admin') {
      const user = {
        username: formInput.username,
        password: formInput.password
      }
      localStorage.setItem('user', JSON.stringify(user));
      of(true).pipe(
        delay(2000),
        tap(() => {
          this.isLoading = false;
          this.router.navigateByUrl('/');
        })
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.isLoggedIn = false;
    this.isLoading = false;
  }

}
