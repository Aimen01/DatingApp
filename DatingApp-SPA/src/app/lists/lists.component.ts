import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { AuthService } from './../_services/Auth.service';
import { Pagination, PaginatedResult } from './../_models/Pagination';
import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  constructor(private userService: UserService, private alertifyService: AlertifyService,
    private route: ActivatedRoute ) {}
  ngOnInit() {
   this.route.data.subscribe(data => {
     this.users = data['users'].result;
     this.pagination = data['users'].pagination;
    });

     this.likesParam ='Likers'
  }
  pageChanged(event: any): void {

    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);
    this.loadUsers();
  }
 
  loadUsers() {
    this.userService
    .getusers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam
       )
    .subscribe(
      (res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      console.log(this.users);
    }, err => this.alertifyService.error('not working!')
    );
    }
}

