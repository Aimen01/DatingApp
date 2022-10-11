import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { MessageService } from '../_services/message.service';
import { AuthService } from '../_services/Auth.service';
 
@Injectable()
export class MessageResolver implements Resolve<Message[]> {
pageNumber = 1;
pageSize = 5;
messageContainer = 'Unread';

    constructor(private router: Router, private messageService: MessageService,
        private alertifyService: AlertifyService, private auth : AuthService) {}

        resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
       return this.messageService.getMessages(this.auth.decodedToken.nameid,this.pageNumber, 
        this.pageSize, this.messageContainer).pipe(
           catchError ( error => {              
            this.alertifyService.error('problem reteving data');
            this.router.navigate(['/home']);
            return of(null);
               })
         );
        }
}

