import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { UserMenuComponent } from './user-menu.component';

import { User } from '../../models/user.model';
import { ResponseMetaData } from '../../models/response-meta-data.model';


@Component({
  selector: 'user-profile-component',
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
            {{ message }}
        </div>

        <div class="ui top attached red inverted secondary menu">
          <div class="header item">
            Change Username
          </div>
        </div>

        <div class="ui form attached segment">
          
          <div class="ui one column grid">
            <div class="column">
              <div class="field">
                <input type="text" placeholder="New Password" name="New Username"
                       [(ngModel)]="username">
              </div>
            </div>
          </div>
        </div>

        <div class="ui one bottom attached buttons">
          <div class="ui button"
               (click)="updateUsername()">Update Username</div>
        </div>


      </div>
    </div>
  `
})
export class UserProfileComponent {

  selected: string = 'profile';
  //username: string = JSON.parse(JSON.stringify(this.authService.user.name)); // Cloning to prevent changes due to bindings.
  username: string = '';

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

  showFailedMessage(message: string) {
    this.message = message
    this.positiveMessage = false;
    this.negativeMessage = true;
    this.messageHidden = false;
  }

  showSuccessMessage(message: string) {
    this.username = '';
    this.message = message
    this.positiveMessage = true;
    this.negativeMessage = false;
    this.messageHidden = false;
  }

  updateUsername() {
    if(this.username.length > 1) {
      this.dataService.changeUserName(this.authService.user, this.username)
                        .then(response => {
                          if(response.error) {
                            this.showFailedMessage(response.error_message);
                          } else {
                            this.authService.user.name = JSON.parse(JSON.stringify(this.username)); // Cloning to prevent changes due to bindings.
                            
                            this.showSuccessMessage('User name has been updated');
                          }
                        });
    }
    else {
      this.showFailedMessage('Username cannot be blank.');
    }
  }

  

}