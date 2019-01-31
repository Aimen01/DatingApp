import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.apiUrl + 'auth/';
jwtHelper = new JwtHelperService();
decodedToken: any;

  constructor(private http: HttpClient) { }
  login(model: any) {

   return this.http.post(this.baseUrl + 'login', model).pipe( // you have to write retune or 
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
         // this for decode the token and send it to browser.
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          console.log(this.decodedToken);
        }
      })
    );
  }
register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
}

loggedIn() {
const token = localStorage.getItem('token'); // to make sure the token is right and not expaired
return !this.jwtHelper.isTokenExpired(token);

}
}
