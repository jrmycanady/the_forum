import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { TFSettings } from '../../models/tf-settings.model';

import { AdminMenuComponent } from './admin-menu.component';

@Component({
  selector: 'admin-settings-component',
  template: `
    
    <div class="ui grid container">
      <div class="four wide column">
        <admin-menu [selected]="selected"></admin-menu>
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
            Forum Global Settings
          </div>
        </div>

        <div class="ui form attached segment">
          
          <div class="ui one column grid">
            <div class="column">
              <div class="field">
                <label>Forum Title</label>
                <input type="text" placeholder="Forum Title" name="title"
                       [(ngModel)]="settings.general_forum_title">
              </div>
              <div class="field">
                <label>JWT Key</label>
                <input type="text" placeholder="JWT Key" name="jwt_key"
                       [(ngModel)]="settings.jwt_key">
              </div>
              <div class="ui toggle checkbox" style="margin-top: 5px;">
                <div class="field">
                    <input type="checkbox" 
                              name="jwtUseDBkey"
                              [(ngModel)]="settings.jwt_use_db_key">
                    <label>Use custom JWT Key</label>
                </div>
              </div>

            </div>
          </div>
          <h4 class="ui horizontal divider header">
            <i class="Alarm icon"></i>
            Notification Settings
          </h4>
          
          <div class="ui one column grid">
            <div class="column">
              <div class="field">
                <label>Email Notifications From Address</label>
                <input type="text" placeholder="admin@forum.example" name="noti_email"
                       [(ngModel)]="settings.email_notification_from_address">
              </div>
              <div class="field">
                <label>New Thread Notification Subject Template</label>
                <input type="text" name="thread_template"
                       [(ngModel)]="settings.email_notifications_thread_subject_template">
              </div>
              <div class="field">
                <label>New Post Notification Subject Template</label>
                <input type="text" name="post_template"
                       [(ngModel)]="settings.email_notifications_post_subject_template">
              </div>
              <div class="field">
                <div class="ui toggle checkbox" style="margin-top: 5px;">
                  <div class="field">
                      <input type="checkbox" 
                                name="enable_thread_notifications"
                                [(ngModel)]="settings.email_notifications_thread_enabled">
                      <label>Enable new thread notifications by email.</label>
                  </div>
                </div>
              </div>

              <div class="field">
                <div class="ui toggle checkbox" style="margin-top: 5px;">
                  <div class="field">
                      <input type="checkbox" 
                                name="enable_post_notifications"
                                [(ngModel)]="settings.email_notifications_posts_enabled">
                      <label>Enable new post notifications by email.</label>
                  </div>
                </div>
              </div>




            </div>
          </div>
        </div>

        <div class="ui one bottom attached buttons">
          <div class="ui button" [attr.disabled]="updateButtonDisabled == true"
               (click)="updateGeneralSettings()">Update Notification Settings</div>
        </div>
        
      </div>
    </div>
  `
})
export class AdminSettingsComponent {

  selected: string = 'settings';
  settings: TFSettings = new TFSettings();

  messageHidden: boolean = true;
  positiveMessage: boolean = false;
  negativeMessage: boolean = false;
  message: string = '';

  updateButtonDisabled: boolean = false;

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
    this.message = message
    this.positiveMessage = true;
    this.negativeMessage = false;
    this.messageHidden = false;
  }

  ngOnInit() {
    
    this.dataService.getTFSettings().then(settings => { this.settings = settings});
  }

  toggleUpdateButton() {
    this.updateButtonDisabled = !this.updateButtonDisabled;
  }

  updateGeneralSettings() {
    this.toggleUpdateButton();
    this.dataService.updateTFSettings(this.settings).then(result => {
      if(result) {
        this.showSuccessMessage("The settings have been updated.");
      } else {
        this.showFailedMessage("The settings failed up update.");
      }
    });
  }


}