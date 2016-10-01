import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { UserMenuComponent } from './user-menu.component';

import { User } from '../../models/user.model';

@Component({
  selector: 'user-settings-component',
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
            Notification Settings
          </div>
        </div>

        <div class="ui form attached segment">
          
          <div class="ui two column grid">
            <div class="column">
              <div class="ui toggle checkbox" style="margin-top: 5px;">
                <input type="checkbox" 
                        name="threadEmailNotifications"
                        [(ngModel)]="user.notify_on_new_thread"
                        (ngModelChange)="updateNotificationSettings('thread')">
                <label>Thread Email Notifications</label>
              </div>
            <div class="column">
              <div class="ui toggle checkbox" style="margin-top: 5px;">
                <input type="checkbox" 
                        name="postEmailNotifications"
                        [(ngModel)]="user.notify_on_new_post"
                        (ngModelChange)="updateNotificationSettings('post')">
                <label>Post Email Notifications</label>
              </div>
            </div>
            </div>
          </div>

        </div>

        <div class="ui one bottom attached buttons">
          <div class="ui button"
               (click)="updateNotificationSettings()">Update Notification Settings</div>
        </div>


      </div>
    </div>
  `
})
export class UserSettingsComponent {

  selected: string = 'settings';
  messageHidden: boolean = true;
  positiveMessage: boolean = false;
  negativeMessage: boolean = false;
  message: string = '';

  user: User = new User;
  is_enabled: boolean;
  notify_on_new_thread: boolean; 
  notify_on_new_post: boolean;

  constructor(
    public dataService: DataService,
    public authService: AuthService) {
      this.is_enabled = authService.user.is_enabled;
      this.notify_on_new_post = authService.user.notify_on_new_post;
      this.notify_on_new_thread = authService.user.notify_on_new_thread;
    }

  ngOnInit() {
    this.dataService.getUser(this.authService.user.id).then(user => {
      this.user = user;
    });
  }

  showFailedMessage(message: string) {
    this.message = message
    this.positiveMessage = false;
    this.negativeMessage = true;
    this.messageHidden = false;
  }

  showSuccessMessage(message: string) {
    this.message = message
    this.positiveMessage = true;
    this.negativeMessage = false;
    this.messageHidden = false;
  }

  updateNotificationSettings(type: string) {
    if(type == 'thread') {
      this.dataService.enableNotifyNewThread(this.user, this.user.notify_on_new_thread).then(metaData => {
        if(metaData.error) {
          // Throw some sort of error.
        }
      })
    }
    else if(type == 'post') {
      this.dataService.enableNotifyNewPost(this.user, this.user.notify_on_new_post).then(metaData => {
        if(metaData.error) {
          // Throw some sort of error.
        }
      })
    }
  }
  

}