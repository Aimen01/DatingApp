import { AuthService } from './../_services/Auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(next => {
      console.log('login successful');
    }, error => {
      console.log('faild to login');
    });
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token; // !! like boolean return true or fulse
  }
  logout() {
    localStorage.removeItem('token');
    console.log('logged out');
  }
}
