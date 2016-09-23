import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
          <div class="ui top attached segment">
            <input type="text" 
                   name="title" 
                   placeholder="Thread Title"
                   [(ngModel)]="threadTitle">
          </div>


          <div class="ui attached segment">
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
            <textarea rows="15" name="title" 
                      placeholder="Thread First Post"
                      [(ngModel)]="threadContent"
                      name="threadContent"></textarea>
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
  constructor(
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService) {


  }

  submitThread() {

    this.dataService.createThread(this.threadTitle, this.threadContent).then(result => {
      if(result) {
        this.router.navigate(['/']);
      }
    });

  }

}