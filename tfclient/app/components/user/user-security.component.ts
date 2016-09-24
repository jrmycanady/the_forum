import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { UserMenuComponent } from './user-menu.component';

import { User } from '../../models/user.model';


@Component({
  selector: 'user-security-component',
  template: `
    
    <div class="ui grid container">
      <div class="four wide column">
        <user-menu [selected]="selected"></user-menu>
      </div>
      <div class="twelve wide column">
        Security Information.
      </div>
    </div>
  `
})
export class UserSecurityComponent {

  selected: string = 'security';
  users: Array<User> = new Array<User>();

  constructor(
    public dataService: DataService,
    public authService: AuthService) {

    }

  

}