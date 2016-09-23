import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { TopMenuComponent } from '../top-menu.component'

@Component({
  selector: 'admin-root-component',
  template: `
    <div class="ui one column grid">
      <div class="column">
        <top-menu [selected]="selected"></top-menu>
      </div>
      <div class="column">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AdminComponent {
  selected: string = 'admin';

  constructor(
    public dataService: DataService,
    public authService: AuthService,
    public route: ActivatedRoute) {

    }

}