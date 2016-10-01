import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { AdminMenuComponent } from './admin-menu.component';

import { User } from '../../models/user.model';


@Component({
  selector: 'admin-root-component',
  template: `
    
    <div class="ui grid container">
      <div class="four wide column">
        <admin-menu [selected]="selected"></admin-menu>
      </div>
      <div class="twelve wide column">

        <div class="ui top attached red inverted secondary menu">
          <div class="header item">
            New User
          </div>
        </div>

        <div class="ui form attached segment">
          
          <div class="ui two column grid">
            <div class="ten wide column">
              <div class="field">
                <input type="text" placeholder="Username" name="username"
                       [(ngModel)]="user.name">
              </div>
              <div class="field">
                <input type="password" placeholder="Password" name="password"
                       [(ngModel)]="user.password">
              </div>
              <div class="field">
                <input type="text" placeholder="user@example.com" name="email_address"
                       [(ngModel)]="user.email_address">
              </div>
            </div>

            <div class="five wide column">
              <div class="field">
               
                <div class="ui toggle checkbox" style="margin-top: 5px;">
                  <input type="checkbox" 
                          name="enabled"
                          [(ngModel)]="user.is_enabled">
                  <label>Account Enabled</label>
                </div>
                <div class="ui toggle checkbox" style="margin-top: 5px;">
                  <input type="checkbox" 
                          name="threadEmailNotifications"
                          [(ngModel)]="user.notify_on_new_thread">
                  <label>Thread Email Notifications</label>
                </div>
                <div class="ui toggle checkbox" style="margin-top: 5px;">
                  <input type="checkbox" 
                          name="postEmailNotifications"
                          [(ngModel)]="user.notify_on_new_post">
                  <label>Post Email Notifications</label>
                </div>
                <label>Role</label>
                <select class="ui dropdown" [(ngModel)]="user.role">
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>

              </div>
              
            </div>

          </div>

                 


        </div>

        <div class="ui two bottom attached buttons">
          <div class="ui button"
               (click)="saveUser()">Save User</div>
        </div>
      </div>
    </div>
  `
})
export class AdminNewUserComponent {

  selected: string = 'users';
  user: User = new User();


  constructor(
    public dataService: DataService,
    public authService: AuthService,
    private router: Router) {

    }

  saveUser() {
    this.dataService.createUser(this.user).then(result => {
      if(result) {
        this.router.navigate(['/admin/users']);
      }
    });
  }
  
}