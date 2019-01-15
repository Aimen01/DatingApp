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
  constructor( private Auth: AuthService) { }

  ngOnInit() {
  }
  register() {
    this.Auth.register(this.model).subscribe(res => {
      console.log('registerd successfully');
    }, error => { console.log('some error happened!'); });
  }

  cancle() {
   this.CancelRegister.emit(false);
  }
}
