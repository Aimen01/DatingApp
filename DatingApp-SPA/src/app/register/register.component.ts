import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from './../_services/Auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 user: User ;
 registerForm: FormGroup;
 bsConfig: Partial<BsDatepickerConfig>; // we use partial to make all required optional
 @Input() valuesFromHome: any;
 @Output() CancelRegister = new EventEmitter();
  constructor( private Auth: AuthService,
    private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
     this.createRegisterForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('',
    //   [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator);
  }
  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
 return g.get('password').value === g.get('confirmPassword').value
  ? null : {'mismatch': true};
  }
  register() {
if (this.registerForm.valid) {
this.user = Object.assign({}, this.registerForm.value);
this.Auth.register(this.user).subscribe( () => {
  this.alertify.success('Registration successful');
}, error => { this.alertify.error('error occurred');
}, () => {
  this.Auth.login(this.user).subscribe( () => {
    this.router.navigate(['/members']);
  });
}
);
}
    // this.Auth.register(this.model).subscribe(res => {

    //  this.alertify.success('registerd successfully');
    // }, error => {
    //   this.alertify.error('some error happened!'); });
    console.log(this.registerForm.value);
  }

  cancle() {
   this.CancelRegister.emit(false);
  }
}
