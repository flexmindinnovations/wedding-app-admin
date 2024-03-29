import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { COLOR_SCHEME, inputThemeVariables } from 'src/util/util';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';
import { SharedService } from 'src/app/services/shared.service';

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
  alert = inject(AlertService);
  subs: Subscription[] = [];
  sharedService = inject(SharedService);
  showPassword: boolean = false;
  passwordToggleIcon = 'eye-outline';
  invalidControl = ' border-red-700 bg-red-200';
  validControl = ' border-gray-300 bg-gray-50';

  ngOnInit() {
    // this.isLoading = true;
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
      userName: ['', [Validators.required]],
      userPassword: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = inputThemeVariables[this.colorScheme];
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleSignIn() {
    this.isLoading = true;
    const formInput = this.formGroup.value;
    if (!this.formGroup.valid) return;
    this.subs.push(
      this.authService.loginUser(formInput)
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.alert.setAlertMessage('User authenticated successfully', AlertType.success);
              const { user } = response;
              of(true).pipe(
                delay(500),
                tap(() => {
                  this.router.navigateByUrl('/');
                  if (user) {
                    const { token } = user;
                    const { permissionList } = user;
                    this.sharedService.setUserPermissions(permissionList);
                    this.sharedService.permissionListMap.set('permissionList', permissionList);
                    this.resetForm();
                  }
                })
              ).subscribe();
            }
          },
          error: (error) => {
            const err = error?.error;
            this.alert.setAlertMessage(err?.message, AlertType.error);
            this.resetForm();
          },
          complete: () => {
            this.resetForm();
          }
        })
    );
  }

  resetForm() {
    this.formGroup.reset();
    this.isLoading = false;
    setTimeout(() => {
      this.subs.forEach((sub) => {
        sub.unsubscribe()
      });
    })
  }

  handlePasswordVisiblity() {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.passwordToggleIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  ngOnDestroy(): void {
    this.isLoggedIn = false;
    this.isLoading = false;
    this.formGroup.reset();
    this.subs.forEach((sub) => {
      sub.unsubscribe()
    });
  }

}
