import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
pageNumber = 1;
pageSize = 5;
likeParam = 'likers';
    constructor(private router: Router, private userService: UserService,
        private alertifyService: AlertifyService) {}

        resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
            console.log(this.likeParam);
       return this.userService.getusers(this.pageNumber, this.pageSize, null, this.likeParam).pipe(
           catchError ( error => {
            this.alertifyService.error('problem reteving data');
            this.router.navigate(['/home']);
            return of(null);
               })
         );
        }
}

