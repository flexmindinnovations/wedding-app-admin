import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { COLOR_SCHEME } from 'src/util/util';
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

  sharedService = inject(SharedService);

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
    // this.colorVarients = buttonThemeVariables[this.colorScheme][this.size];
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleSignIn() {
    this.isLoading = true;
    const formInput = this.formGroup.value;
    if (!this.formGroup.valid) return;
    this.authService.loginUser(formInput).subscribe({
      next: (response: any) => {
        if (response) {
          const { user } = response;
          of(true).pipe(
            delay(2000),
            tap(() => {
              this.isLoading = false;
              this.router.navigateByUrl('/');
              if (user) {
                const { permissionList } = user;
                this.alert.setAlertMessage('User authenticated successfully', AlertType.success);
                this.sharedService.setUserPermissions(permissionList);
                this.sharedService.permissionListMap.set('permissionList', permissionList);
              }
            })
          ).subscribe();
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedIn = false;
    this.isLoading = false;
  }

}
