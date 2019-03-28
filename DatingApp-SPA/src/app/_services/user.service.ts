import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

// const httpOptions = {
//   headers : new HttpHeaders({
//   'Authorization' : 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl = environment.apiUrl;
constructor( private http: HttpClient) { }

getusers(): Observable<User[]> {
  return this.http.get<User[]>(this.baseUrl + 'users' ); // ,httpOptions
}

getuser(id: any): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id); // , httpOptions
}

updateUser(id: number, user: User) {
return this.http.put(this.baseUrl + 'users/' + id, user );
}
setMainPhoto (userId: number, id: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  // in psot requset we required to send something in the body, we send empty opject to satisfy it
}
deletePhoto( userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}

}

