import { AuthService } from './_services/Auth.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  constructor(private Auth: AuthService, private presence: PresenceService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this.Auth.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.Auth.addUserInfo(user);
      this.Auth.currentUser = user;
      this.presence.ceateHubConnection(user);
      this.Auth.changeMemberPhoto(user.photoUrl);
    }
  }
}
