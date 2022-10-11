import { Component, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/Message';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { AuthService } from '../_services/Auth.service';

@Component({
  selector: 'app-massages',
  templateUrl: './massages.component.html',
  styleUrls: ['./massages.component.css']
})
export class MassagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer: string;
  constructor( private messageService: MessageService, private alertifyService: AlertifyService,
    private route: ActivatedRoute, private auth: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      console.log(this.messages);
      this.pagination = data['messages'].pagination;
      this.messageContainer = "Unread"
  })
}
pageChanged(event: any): void {
  this.pagination.currentPage = event.page;
  console.log(this.pagination.currentPage);
  this.loadMessages();
}
loadMessages() {
  this.messageService
  .getMessages(this.auth.decodedToken.nameid,this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer
     )
  .subscribe(
    (res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    console.log(this.messages);
  }, err => this.alertifyService.error('not working!')
  );
  }
messageDelete( id: number)
{
    this.alertifyService.confirm('are you sure do you want to delete it',()=>{
     this.messageService.deleteMessage(this.auth.decodedToken.nameid,id).subscribe(()=>{
     this.messages.splice(this.messages.findIndex(u=>u.id ===id),1);
       this.alertifyService.success('the message has been deleted');
  },error=> this.alertifyService.error('some errors happened!'))
}
  )
}
}
