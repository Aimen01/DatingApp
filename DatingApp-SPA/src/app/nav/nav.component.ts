import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/Auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('login successfully');

    }, error => {
      this.alertify.error('Wrong password');

    });
  }
  loggedIn() {
    return this.authService.loggedIn();

    // const token = localStorage.getItem('token');
    // return !!token; // !! like boolean return true or fulse
  }
  logout() {
    localStorage.removeItem('token');
    this.alertify.message('logged out');
  }
}
