import { AuthService } from './../../_services/Auth.service';
import { UserService } from './../../_services/user.service';
import { AlertifyService } from './../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
import { User } from 'src/app/_models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
 user: User;
 photoUrl: String;
 @ViewChild('editForm') editForm: NgForm;
@HostListener('window:beforeunload', ['$event'])
unloadNotification($event: any) {
  if (this.editForm.dirty) {
    $event.returnValue = true;
  }
}

  constructor( private activatedRoute: ActivatedRoute, private alertifyService: AlertifyService 
    , private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.user = data['user'];
    });

    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  updateUser() {
 this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe( next => {
  this.alertifyService.success('data saved');
  this.editForm.reset(this.user);
 }, error => { this.alertifyService.error('some error accured!');
});
  }
  updateMainPhoto( photoUrl) {
     this.user.photoUrl = photoUrl;
   }

}
