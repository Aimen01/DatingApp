import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.apiUrl + 'auth/';
jwtHelper = new JwtHelperService();
decodedToken: any;
currentUser: User;
photUrl = new BehaviorSubject<string>('../../assets/user.png');
currentPhotoUrl = this.photUrl.asObservable();

  constructor(private http: HttpClient) { }
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
         // this for decode the token and send it to browser.
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
         this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }
register(user: User) {
  return this.http.post(this.baseUrl + 'register', user);
}

loggedIn() {
const token = localStorage.getItem('token'); // to make sure the token is right and not expaired
return !this.jwtHelper.isTokenExpired(token);

}
}
