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
                <a href="#">{{ p. username }}</a>
                <div class="sub header">Admin</div>
                
              </h3>
 
            </div>
            
            <div class="fourteen wide column">
              <div class="ui grid">
                <div class="fifteen wide column">
                  <div [innerHTML]="domSanitizer.bypassSecurityTrustHtml(markdown.makeHtml(p.content))"></div>
                </div>
                <div class="one wide column">
                  <div 
                       *ngIf="authService.user.id == p.user_id"
                       class="ui vertical small basic icon buttons">
                    <button class="ui button"><i class="edit icon"></i></button>
                    <button class="ui button"><i class="erase icon"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="ui top attached segment">
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
          <div class="ui attached segment">
            <form class="ui form" #postForm="ngForm">
              <div class="field">
                <textarea 
                  placeholder="Reply goes here..."
                  [(ngModel)]="postText"
                  name = "postText"
                  autofocus
                  (keyup.ctrl.enter)="submitPost()"></textarea>
              </div>
            </form>
          </div>
            <div class="ui two bottom attached buttons">
            <div class="ui button">Reset</div>
            <div class="ui button" (click)="submitPost()">Submit</div>
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

  getThreadData() {
    this.dataService.getThread(this.threadId).then(thread => this.thread = thread);
    this.dataService.getPosts(this.threadId).then(posts => this.posts = posts);
  }

  submitPost() {
    this.dataService.createPost(this.threadId, this.postText).then(result => {
      if(result) {
        this.postText = '';
        this.getThreadData();
      }
    });
  }


  
  
}