import { ActivatedRoute } from '@angular/router';
import { User } from './../../_models/user';
import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  constructor(private userService: UserService, private alertifyService: AlertifyService,
    private route: ActivatedRoute ) {}
  ngOnInit() {
   this.route.data.subscribe(data => {
     this.users = data['users'];
    });
  }
  getUser() {
    // this.userService.getusers().subscribe((user: User[]) => {this.users = user;
    //   console.log(this.users);
    // }, err => this.alertifyService.error('not working!')
    // );
    }
}
