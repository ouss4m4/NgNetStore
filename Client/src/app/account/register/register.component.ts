import { Component } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  formErrors: string[] = [];
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      displayName: [null, Validators.required],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
        ],
        [this.checkIfEmailExists()],
      ],
      password: [
        null,
        [
          Validators.required,
          /* Validators.pattern(
            "(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$"
          ), */
        ],
      ],
    });
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(
      (res) => {
        this.router.navigateByUrl('/shop');
      },
      (err) => {
        console.log(err);
        this.formErrors = err.errors;
      }
    );
  }

  checkIfEmailExists(): AsyncValidatorFn {
    return (control) => {
      return timer(1000).pipe(
        switchMap(() => {
          if (!control.value) return of(null);
          return this.accountService.checkEmailExists(control.value).pipe(
            map((res) => {
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }
}
