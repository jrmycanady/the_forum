import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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
    
      <a class="right item"
        (click)="logout()">
        Logout ({{ authService.user.name }})
      </a>
    </div>
  `
})
export class TopMenuComponent {
  @Input() selected: string = 'none';

  constructor(
    public authService: AuthService,
    private router: Router) {

  }

  logout() {
    this.authService.deauthenticate();
    this.router.navigate(['/login']);
  }
}


