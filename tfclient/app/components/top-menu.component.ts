import { Component, Input } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'top-menu',
  template: `
    <div class="ui secondary pointing red menu">
      <div class="header item">
        The Forum
      </div>
      <a class="item" [class.active]="selected == 'threads'"
         [routerLink]="['/']">
        Threads
      </a>
      <a class="item" [class.active]="selected == 'thread'"
         [routerLink]="['/thread']">
        New Thread
      </a>
    
      <div class="right header item">
        {{ authService.user.name }}
      </div>
    </div>
  `
})
export class TopMenuComponent {
  @Input() selected: string = 'none';

  constructor(public authService: AuthService) {

  }

}


