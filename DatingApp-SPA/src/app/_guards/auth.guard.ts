import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../_services/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService,
    private alertify: AlertifyService) {}
  canActivate(next: ActivatedRouteSnapshot): | boolean {
  const roles = next.firstChild.data['roles'] as Array<string>
    if(roles){
      const match = this.authService.roleMatch(roles);
      if(match== true){
 
        return true;
      }else {
        this.router.navigate(['members']);
        this.alertify.error('You are not authorised to access this area')
      }
    }
    if (this.authService.loggedIn()) {
    return true;
   }
   this.alertify.error('you can not access this!!');
   this.router.navigate(['/home']);
  }
}
