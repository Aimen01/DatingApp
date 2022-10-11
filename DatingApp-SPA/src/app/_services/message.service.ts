import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';
import { map, take } from 'rxjs/operators';
import { b } from '@angular/core/src/render3';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  constructor(private http: HttpClient, private alertifyService: AlertifyService) { }

  createHubConnection(user: any, recipientId: string) {
    console.log("message connection");

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + recipientId, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on('RecieveMessageThread', message => {
      console.log('Messaged', message);
      this.messageThreadSource.next(message);
    });

    this.hubConnection.on('NewMessage', message => {
      console.log("NewMessage", message);
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message]);
      });
    });

    this.hubConnection.on('UserIsOffline', username => {
      console.log("Message Off");
      this.alertifyService.warning(username);
    });
  }
  stopHunConnection() {
    if (this.hubConnection) {
      console.log("Message Connection stopped!");
      this.hubConnection.stop().catch(err => console.log(err));
    }
  }
  getMessages(userid, page?, itemsPerPage?, messageContainer?): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (messageContainer != null) {
      params = params.append("messageContainer", messageContainer);
    }
    return this.http.get<Message[]>(this.baseUrl + 'users/' + userid + '/messages', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }));
  }
  getMessageThread(userId: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId);
  }
  async sendMessage(userId: number, message: Message) {
    //return this.http.post(this.baseUrl + 'users/' + userId + '/messages', message);
    console.log(message);
    return this.hubConnection.invoke('SendMessage', message)
      .catch(error => console.log(error));
  }
  deleteMessage(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }
  readMessage(userid: number, messageId: number) {
    this.http.post(this.baseUrl + 'users/' + userid + '/messages/' + messageId + '/read', {})
      .subscribe();
  }

}
