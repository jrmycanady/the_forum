import { Component } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

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
          <h2 class="ui top attached header">
            {{ thread.title }}
          </h2>
          <div class="ui attached segment">
            <div class="ui divided items">
              <div class="item"
                  *ngFor="let p of posts">
                
                <div class="middle aligned content">
                  <h3> {{ p.username }} </h3>
                  {{ p.content }}
                </div>
              </div>
            </div>
          </div>

          <div class="ui attached segment">
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
            <div class="ui bottom attached segment">
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
  threadUuid: string;
  posts: Array<Post> = new Array<Post>();
  postText: string = '';
  selected: string = 'threads';

  constructor(
    public dataService: DataService,
    public authService: AuthService,
    private route: ActivatedRoute) {

  }

  ngOnInit() : void {
    
    // Get thread ID
    this.sub = this.route.params.subscribe(params => {
      this.threadUuid = params['thread_uuid'];
      this.getThreadData();
      
        
    });

  }

  getThreadData() {
    this.dataService.getThread(this.threadUuid).then(thread => this.thread = thread);
    this.dataService.getPosts(this.threadUuid).then(posts => this.posts = posts);
  }

  submitPost() {
    this.dataService.createPost(this.threadUuid, this.postText).then(result => {
      if(result) {
        this.postText = '';
        this.getThreadData();
      }
    });
  }


  
  
}