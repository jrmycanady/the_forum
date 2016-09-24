import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { AdminMenuComponent } from './admin-menu.component';

import { User } from '../../models/user.model';


@Component({
  selector: 'admin-users-component',
  template: `
    
    <div class="ui grid container">
      <div class="four wide column">
        <admin-menu [selected]="selected"></admin-menu>
      </div>
      <div class="twelve wide column">

        <div class="ui top attached secondary menu">
          <a class="item" [routerLink]="['/admin/new-user']">
            <i class="plus icon"></i>
            Add User
          </a>
          <a class="disabled item">
            <i class="delete icon"></i>
            Delete Users
          </a>

          <div class="right menu">
            <div class="ui right aligned category disabled fluid search item">
              <div class="ui transparent icon input">
                <input class="prompt" type="text" placeholder="Search users..." disabled>
                <i class="search link icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="ui bottom attached segment">
          <div class="ui divided items">
            <div class="item"
              *ngFor="let u of users">
              <div class="ui image">
                <h2 class="ui icon header">
                  
                  <i class="circular user icon"></i>
                </h2>
              </div>
              <div class="content">
                <div class="header">{{u.name}}</div>
                <div class="meta">
                  {{u.email_address}}
                </div>
                <div class="description">
                  <p></p>
                </div>
                <div class="extra">
                  <div class="ui blue basic label">{{u.role}}</div>
                  <div class="ui right floated disabled mini green button">
                    Edit
                  </div>
                  <div class="ui right floated disabled mini red button">
                    Delete
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  `
})
export class AdminUsersComponent {

  selected: string = 'users';
  users: Array<User> = new Array<User>();

  constructor(
    public dataService: DataService,
    public authService: AuthService) {

    }

  ngOnInit() {
    this.dataService.getUsers().then(users => this.users = users);
    
  }

}