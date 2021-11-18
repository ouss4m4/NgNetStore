import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('guard check');
    return this.accountService.currentUser$.pipe(
      map((auth) => {
        console.log('useR?', auth);
        if (auth.email === '') {
          this.router.navigate(['account/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
