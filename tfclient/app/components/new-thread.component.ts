import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { Converter } from "showdown";

import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'new-thread-form',
  template: `
    <div class="ui one column grid">
      <div class="column">
        <top-menu [selected]="selected"></top-menu>
      </div>

      <div class="column">

        <div class="ui container form">

          <div class="ui message"
             [class.hidden]="messageHidden"
             [class.positive]="positiveMessage"
             [class.negative]="negativeMessage">
            {{ message }}
          </div>

          <div class="ui top attached red inverted secondary menu">
            <div class="header item">
              New Thread
            </div>
            
          </div>

          <div class="ui attached segment">
            <input type="text" 
                   tabindex="1"
                   autofocus
                   name="title" 
                   placeholder="Thread Title"
                   [(ngModel)]="threadTitle">
          </div>


          <div class="ui attached segment">
            <div class="ui grid">
              <div class="ten wide column">
                <div class="ui small basic icon buttons">
                  <button class="ui disabled button"><i class="Linkify icon"></i></button>
                  <button class="ui disabled button"><i class="Unlinkify icon"></i></button>
                  <button class="ui disabled button"><i class="Header icon"></i></button>
                  <button class="ui disabled button"><i class="Bold icon"></i></button>
                  <button class="ui disabled button"><i class="Quote Left icon"></i></button>
                  <button class="ui disabled button"><i class="Italic icon"></i></button>
                  <button class="ui disabled button"><i class="Attach icon"></i></button>
                  <button class="ui disabled button"><i class="Image icon"></i></button>
                </div>
              </div>
              <div class="six wide right aligned column">
                <div class="ui small basic icon buttons">
                  <button class="ui right floated button"
                          [class.active]="previewModeEnalbed == true"
                          (click)="togglePreviewMode()">
                          <i class="Unhide icon"></i>Preview</button>
                </div>
              </div>
            </div>
            
          </div>

          <div class="ui attached segment">
            <textarea rows="15" name="title"
                      tabindex="2"
                      placeholder="Thread First Post"
                      [(ngModel)]="threadContent"
                      name="threadContent"
                      *ngIf="previewModeEnalbed == false"></textarea>
            <div *ngIf="previewModeEnalbed"
                       [innerHTML]="domSanitizer.bypassSecurityTrustHtml(markdown.makeHtml(threadContent))"></div>
          </div>

          <div class="ui one bottom attached buttons">
            <div class="ui button" (click)="submitThread()">Submit</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NewThreadComponent {
  threadContent: string;
  threadTitle: string;
  selected: string = 'thread';

  messageHidden: boolean = true;
  positiveMessage: boolean = false;
  negativeMessage: boolean = false;
  message: string = '';

  markdown: Converter = new Converter();
  previewModeEnalbed: boolean = false;

  constructor(
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private domSanitizer: DomSanitizer) {


  }

  /**
   * Shows a failed message box with the message provided.
   * 
   * @param {string} message - The message to show.
   */
  showFailedMessage(message: string) {
    this.message = message
    this.positiveMessage = false;
    this.negativeMessage = true;
    this.messageHidden = false;
  }

  /**
   * Shows a successful message box with the message provided.
   * 
   * @param {string} message - The message to show.
   */
  showSuccessMessage(message: string) {
    this.message = message
    this.positiveMessage = true;
    this.negativeMessage = false;
    this.messageHidden = false;
  }

  /**
   * Submits the form info to create a new thread.
   */
  submitThread() {

    if(!this.threadContent) {
      this.showFailedMessage('Content cannot be empty.');
    }
    else if(!this.threadTitle) {
      this.showFailedMessage('Title cannot be empty.');
    }
    else {
      this.dataService.createThread(this.threadTitle, this.threadContent).then(meta => {
        if(!meta.error) {
          this.router.navigate(['/']);
        }
      });
    }

  }

  /**
   * Toggles the post reply preview mode.
   */
  togglePreviewMode() {
    if(this.previewModeEnalbed) {
      this.previewModeEnalbed = false;
    } else {
      this.previewModeEnalbed = true;
    }
  }

}