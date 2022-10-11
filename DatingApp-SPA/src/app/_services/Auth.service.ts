import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { element } from '@angular/core/src/render3/instructions';
import { PresenceService } from './presence.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photUrl = new BehaviorSubject<string>('../../assets/user.png');
  userInfo = new BehaviorSubject<string[]>([]);
  currentUserInfo$ = this.userInfo.asObservable();
  currentPhotoUrl = this.photUrl.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }
  changeMemberPhoto(photoUrl: string) {
    this.photUrl.next(photoUrl);
  }
  login(model: any) {

    return this.http.post(this.baseUrl + 'login', model).pipe( // you have to write retune or
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.addUserInfo(user.user);
          // this for decode the token and send it to browser.
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.presence.ceateHubConnection(user);
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }
  addUserInfo(user: any) {
    this.userInfo.next(user);
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token'); // to make sure the token is right and not expaired
    return !this.jwtHelper.isTokenExpired(token);

  }
  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;

        return;
      }
    });
    return isMatch;
  }
}
