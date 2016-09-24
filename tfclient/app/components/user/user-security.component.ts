import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { UserMenuComponent } from './user-menu.component';

import { User } from '../../models/user.model';


@Component({
  selector: 'user-security-component',
  template: `
    
    <div class="ui grid container">
      <div class="four wide column">
        <user-menu [selected]="selected"></user-menu>
      </div>
      <div class="twelve wide column">
        
        <div class="ui message"
             [class.hidden]="messageHidden"
             [class.positive]="positiveMessage"
             [class.negative]="negativeMessage">
          <div class="header">
            {{ message }}
          </div>
        </div>

        <div class="ui top attached red inverted secondary menu">
          <div class="header item">
            Change Password
          </div>
        </div>

        <div class="ui form attached segment">
          
          <div class="ui one column grid">
            <div class="column">
              <div class="field">
                <input type="password" placeholder="New Password" name="newPassword1"
                       [(ngModel)]="newPassword1">
              </div>
              <div class="field">
                <input type="password" placeholder="New Password Again" name="newPassword2"
                       [(ngModel)]="newPassword2">
              </div>
            </div>
          </div>

        </div>

        <div class="ui one bottom attached buttons">
          <div class="ui button"
               (click)="updatePassword()">Update Password</div>
        </div>


      </div>
    </div>
  `
})
export class UserSecurityComponent {

  selected: string = 'security';
  newPassword1: string = '';
  newPassword2: string = '';
  messageHidden: boolean = true;
  positiveMessage: boolean = false;
  negativeMessage: boolean = false;
  message: string = '';

  constructor(
    public dataService: DataService,
    public authService: AuthService) {

    }

  updatePassword() {
    if(this.newPassword1.length > 7 && this.newPassword2.length > 7 && this.newPassword1 == this.newPassword2) {
      this.dataService.changeUserPassword(this.authService.user, this.newPassword1)
                    .then(success => {
                      if(success) {
                        this.newPassword1 = '';
                        this.newPassword1 = '';
                        this.message = "Password successfully updated."
                        this.positiveMessage = true;
                        this.negativeMessage = false;
                        this.messageHidden = false;
                        
                      } else {
                        alert('failed!');
                      }
                    });
    } else {
      this.message = "Password failed to updated."
      this.positiveMessage = false;
      this.negativeMessage = true;
      this.messageHidden = false;
    }
    
  }

  

}