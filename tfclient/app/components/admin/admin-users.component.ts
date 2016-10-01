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
            <div class="item"  *ngFor="let u of users">  
              <div class="ui grid form">
                <div class="four wide column">
                  <h3>{{u.name}}</h3>
                  {{u.email_address}}<br>
                  Joined: <br>{{u.created_on | date:'short'}}
                </div>
                
                <div class="six wide column">
                  <div class="ui toggle checkbox" style="margin-top: 5px;">
                    <input type="checkbox" 
                           name="enabled"
                           [(ngModel)]="u.is_enabled"
                           (ngModelChange)="saveUser(u, 'is_enabled')"
                           [disabled]="authService.user.id == u.id">
                    <label>Account Enabled</label>
                  </div>
                  <div class="ui toggle checkbox" style="margin-top: 5px;">
                    <input type="checkbox" 
                           name="threadEmailNotifications"
                           [(ngModel)]="u.notify_on_new_thread"
                           (ngModelChange)="saveUser(u, 'notify_on_new_thread')">
                    <label>Thread Email Notifications</label>
                  </div>
                  <div class="ui toggle checkbox" style="margin-top: 5px;">
                    <input type="checkbox" 
                           name="postEmailNotifications"
                           [(ngModel)]="u.notify_on_new_post"
                           (ngModelChange)="saveUser(u, 'notify_on_new_post')">
                    <label>Post Email Notifications</label>
                  </div>
                </div>
                <div class="six wide column">
                  <div class="field">
                    <label>Role</label>
                    <select class="ui dropdown" [(ngModel)]="u.role"
                            (ngModelChange)="saveUser(u, 'role')"
                            [disabled]="authService.user.id == u.id">
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  <div>
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


  /**
   * Saves any updates to the user.
   * 
   * @param {User} u - The user to update.
   */
  saveUser(u: User, change: string) {
    if(change == 'is_enabled'){
      this.dataService.enableUser(u, u.is_enabled)
                      .then(response => {
                        
                        if(response.error) {
                          u.is_enabled = !u.is_enabled;
                        } else {
                          // Add update message here.
                        }
                      });
    }
    else if(change == 'notify_on_new_thread'){
      this.dataService.enableNotifyNewThread(u, u.notify_on_new_thread)
                      .then(response => {
                        
                        if(response.error) {
                          u.notify_on_new_thread = !u.notify_on_new_thread;
                        } else {
                          // Add update message here.
                        }
                      });
    }
    else if(change == 'notify_on_new_post'){
      this.dataService.enableNotifyNewPost(u, u.notify_on_new_post)
                      .then(response => {
                        
                        if(response.error) {
                          u.notify_on_new_post = !u.notify_on_new_post;
                        } else {
                          // Add update message here.
                        }
                      });
    }
    else if(change == 'role') {
      this.dataService.changeUserRole(u, u.role)
                      .then(response => {
                        if(response.error) {
                        } else {
                          // Add update message here.
                        }
                      });
    }
  }

}