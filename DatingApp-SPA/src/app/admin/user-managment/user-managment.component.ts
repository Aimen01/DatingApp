import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { User } from 'src/app/_models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { UrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService) { }
  users: User[];
  ngOnInit() {
    this.getUsersWithRoles();
  }
  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users
    }, err => console.log(err.error));
  }

  editRolesModel(user: User) {
    console.log(user);

    const initialState = {
      user,
      roles: this.getRolesArray(user),
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState });
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
   
      
      if (rolesToUpdate) {

        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames]
        },
          err => console.log(err.error));
      }
    })
  }
  private getRolesArray(user: User) {
    const roles = [];
    const userRoles = user.roles;
    const availabeRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' },
      { name: 'VIP', value: 'VIP' },

    ];
    for (let i = 0; i < availabeRoles.length; i++) {
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        if (availabeRoles[i].name === userRoles[j]) {
          isMatch = true;
          availabeRoles[i].checked = true;
          roles.push(availabeRoles[i]);
          break;
        }
      }
      if (!isMatch) {
        availabeRoles[i].checked = false;
        roles.push(availabeRoles[i]);
      }
    }
    return roles;
  }
}

