import { Component } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';

import { Converter } from "showdown";

import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

import { Thread } from '../models/thread.model';
import { TopMenuComponent } from './top-menu.component';
import { Post } from '../models/post.model';



@Component({
  selector: 'thread-view',
  template: `
    <div class="ui one column grid">
      <div class="column">
        <top-menu [selected]="selected"></top-menu>
      </div>
      <div class="column">
        <div class="ui container">
          <h2 class="ui header">
            {{ thread.title }}
          </h2>



          <div class="ui grid segment"
               *ngFor="let p of posts">
            <div class="two wide column">
              
              <h3 class="ui header">
                <a href="#">{{ p.username }}</a>
                <div class="sub header" style="font-size: 0.6em;">
                Joined: {{p.user_join_date | date:'shortDate'}}<br>
                Posts: {{p.user_post_count}}</div>
                
              </h3>
 
            </div>
            
            <div class="fourteen wide column">
              <div class="ui grid">
                <div class="fifteen wide column">
                  <div *ngIf="editedPost.id != p.id"
                       [innerHTML]="domSanitizer.bypassSecurityTrustHtml(markdown.makeHtml(p.content))"></div>
                  <div class="ui form" *ngIf="editedPost.id == p.id">
                    <div class="field">
                      <textarea
                         
                        placeholder=""
                        [(ngModel)]="editedPost.content"
                        name = "editPostContent"
                        autofocus
                        (keyup.ctrl.enter)="submitPost()" style="margin-bottom: 3px;"></textarea>
                      <button class="ui button" (click)="cancelPostEdit()">Cancel</button>
                      <button class="ui button" (click)="submitPostEdit(p)">Save Update</button>
                    </div>
                  </div>
                </div>
                <div class="one wide column">
                  <div 
                       *ngIf="authService.user.id == p.user_id"
                       class="ui vertical small basic icon buttons">
                    <button class="ui button" (click)="editPost(p.id, p.content)"><i class="edit icon"></i></button>
                    <button class="ui button" (click)="deletePost(p)"><i class="erase icon"></i></button>
                  </div>
                </div>
                <div class="right aligned sixteen wide column" style="margin: 0px; padding: 0px; margin-right: 5px;">
                  
                  <div class="sub header" style="font-size: .7em;">
                    <span *ngIf="p.created_on != p.modified_on">Edited On: {{p.modified_on | date:'short'}}  --  </span>
                    Posted On: {{p.created_on | date:'short'}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="ui message"
             [class.hidden]="messageHidden"
             [class.positive]="positiveMessage"
             [class.negative]="negativeMessage">
            {{ message }}
          </div>

          <div class="ui top attached segment">
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
            <form class="ui form" #postForm="ngForm"
                  *ngIf="previewModeEnalbed == false">
              <div class="field">
                <textarea 
                  placeholder="Reply goes here..."
                  [(ngModel)]="postText"
                  name = "postText"
                  autofocus
                  (keyup.ctrl.enter)="submitPost()"></textarea>
              </div>
            </form>
            <div *ngIf="previewModeEnalbed"
                       [innerHTML]="domSanitizer.bypassSecurityTrustHtml(markdown.makeHtml(postText))"></div>
          </div>
            <div class="ui one bottom attached buttons">
            <div class="ui button" (click)="submitPost()"
                 [class.disabled]="submitButtonDisabled == true">Submit</div>
          </div>

          


        </div>
      </div>
    </div>
    
  `
})
export class ThreadViewComponent {

  private sub: Subscription;
  thread: Thread = new Thread();
  threadId: string;
  posts: Array<Post> = new Array<Post>();
  postText: string = '';
  selected: string = 'threads';
  markdown: Converter = new Converter();
  editedPost: Post = new Post();
  editPostEnabled: Boolean = false;
  previewModeEnalbed: Boolean = false;
  submiit
  messageHidden: boolean = true;
  positiveMessage: boolean = false;
  negativeMessage: boolean = false;
  message: string = '';
  submitButtonDisabled: boolean = false;

  constructor(
    public dataService: DataService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer) {

  }

  ngOnInit() : void {
    
    // Get thread ID
    this.sub = this.route.params.subscribe(params => {
      this.threadId = params['thread_id'];
      this.getThreadData();
      
    });
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
   * Updates the local copy of the thread data.
   */
  getThreadData() {
    this.dataService.getThread(this.threadId).then(thread => this.thread = thread);
    this.dataService.getPosts(this.threadId).then(posts => this.posts = posts);
  }

  /**
   * Deletes the selected post.
   * 
   * @param {Post} p - The post that will be deleted.
   */
  deletePost(p: Post) {
    this.dataService.deletePost(p).then(result => {
      if(result) {
        this.getThreadData();
      } else {
        // There was an error.
      }
    })
  }

  /**
   * Submits the data currently in the reply field as a post to the thread.
   */
  submitPost() {
    if(this.postText) {
      this.toggleSubmit();
      this.dataService.createPost(this.threadId, this.postText).then(result => {
        if(result) {
          this.postText = '';
          this.getThreadData();
          this.previewModeEnalbed = false;
        } else {
          this.showFailedMessage("Reply failed to be process.");
        }
        this.toggleSubmit();
      });
    } else {
      this.showFailedMessage("Reply cannot be empty.");

    }
    
  }

  /**
   * Submits an edit for the post.
   */
  submitPostEdit(p: Post) {
    this.dataService.updatePost(this.editedPost.id, this.editedPost.content).then(result => {
      if(result) {
        p.content = this.editedPost.content;
        this.cancelPostEdit();
        // Update post and save.
      } else {
        // Popup error.
      }
    })
  }

  /**
   * Configures the local edited copy of a post.
   */
  editPost(id: string, content: string) {
    this.editedPost.id = id;
    this.editedPost.content = content;
  }

  /**
   * Cancle's the editing of a post.
   */
  cancelPostEdit() {
    this.editedPost.id = "";
    this.editedPost.content = "";
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

  /**
   * Toggles the enablement of the submit button.
   */
  toggleSubmit() {
    this.submitButtonDisabled = !this.submitButtonDisabled;
  }
  
  
}