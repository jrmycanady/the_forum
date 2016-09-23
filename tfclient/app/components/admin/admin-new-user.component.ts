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
            <div class="eleven wide column">
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

            <div class="three wide column">
              <div class="field">
                <label>Settings</label>
                <div class="ui toggle checkbox">
                  <input type="checkbox">
                  <label>Admin</label>
                </div>
              </div>

              <div class="field">
                <div class="ui toggle checkbox">
                  <input type="checkbox">
                  <label>Enabled</label>
                </div>
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