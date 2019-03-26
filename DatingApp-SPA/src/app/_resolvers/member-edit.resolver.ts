import { AuthService } from './../_services/Auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private router: Router, private userService: UserService,
    private authService: AuthService, private alertifyService: AlertifyService) {}
       resolve(route: ActivatedRouteSnapshot): Observable<User> {
       return this.userService.getuser(this.authService.decodedToken.nameid).pipe(
           catchError ( error => {
            this.alertifyService.error('problem reteving your data');
            this.router.navigate(['/members']);
            return of(null);
            })
         );
        }
}

