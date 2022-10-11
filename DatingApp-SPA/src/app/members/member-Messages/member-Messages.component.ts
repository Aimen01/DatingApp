import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'src/app/_services/message.service';
import { AuthService } from 'src/app/_services/Auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Message } from 'src/app/_models/Message';
import { tap } from 'rxjs/operators';
import { locateHostElement } from '@angular/core/src/render3/instructions';


@Component({
  selector: 'app-member-Messages',
  templateUrl: './member-Messages.component.html',
  styleUrls: ['./member-Messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  @Input() messages: Message[];
  newMessage: any = {}; //empty object 
  constructor(public messageServive: MessageService, private auth: AuthService,
    private alertfy: AlertifyService) { }

  ngOnInit() {
    // this.loadMessage()
    
  }
  loadMessage() {
    const recipientId = +this.auth.decodedToken.nameid;
    // this.messageServive.getMessageThread(this.auth.decodedToken.nameid, this.recipientId)
    //   .pipe(
    //     tap(messages => {
    //       for (let i = 0; i < messages.length; i++) {
    //         if (messages[i].isRead === false && messages[i].recipientId === recipientId)

    //           this.messageServive.readMessage(recipientId, messages[i].id);
    //       }
    //     }
    //     )
    //   )
    //   .subscribe(
    //     r => {
    //       this.messages = r;
    //     },
    //     err => this.alertfy.error("this is error")
    //   );
  }
  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.messageServive.sendMessage(this.auth.decodedToken.nameid, this.newMessage)
      .then(() => {

      });
  }
  //   console.log(this.auth.decodedToken.nameid, this.newMessage);

  //   this.messageServive.sendMessage(this.auth.decodedToken.nameid, this.newMessage)
  //     .subscribe((message: Message) => {
  //       // this.messages.unshift(message);
  //       console.log(message)
  //       this.newMessage.content = '';
  //     }, error => {
  //       this.alertfy.error("error eccured")
  //     })
  // }

}
