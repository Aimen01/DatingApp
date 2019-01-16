import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/Auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 model: any = {};
 @Input() valuesFromHome: any;
 @Output() CancelRegister = new EventEmitter();
  constructor( private Auth: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }
  register() {
    this.Auth.register(this.model).subscribe(res => {

     this.alertify.success('registerd successfully');
    }, error => { 
      this.alertify.error('some error happened!'); });
  }

  cancle() {
   this.CancelRegister.emit(false);
  }
}
