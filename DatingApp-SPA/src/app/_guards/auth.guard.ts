import { AlertifyService } from './../_services/alertify.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService,
    private alertify: AlertifyService) {}
  canActivate(): | boolean {
    if (this.authService.loggedIn()) {
    return true;
   }
   this.alertify.error('you can not access this!!');
   this.router.navigate(['/home']);
  }
}
