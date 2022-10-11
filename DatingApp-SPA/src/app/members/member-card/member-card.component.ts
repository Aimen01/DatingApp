import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/Auth.service';
import { User } from './../../_models/user';
import { Component, OnInit, Input } from '@angular/core';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(private authService: AuthService,
    private userService: UserService, private alertifyService: AlertifyService, public presence: PresenceService) { }

  ngOnInit() {
  }
  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe(data => {
      this.alertifyService.success('You have liked:' + this.user.knownAs);
    }, error => {
      this.alertifyService.error('the user already liked');
    });
  }
}
