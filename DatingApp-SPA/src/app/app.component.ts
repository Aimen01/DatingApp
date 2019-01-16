import { AuthService } from './_services/Auth.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  constructor(private Auth: AuthService) {}

ngOnInit() {
const token = localStorage.getItem('token');
if (token) {
  this.Auth.decodedToken = this.jwtHelper.decodeToken(token);
}

}
}
