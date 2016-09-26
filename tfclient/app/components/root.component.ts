import { Component, Input } from '@angular/core';

import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

import { Thread } from '../models/thread.model';
import { TopMenuComponent } from './top-menu.component'



@Component({
  selector: 'root-component',
  template: `
    <div class="ui one column grid">
      <div class="column">
        <top-menu [selected]="selected"></top-menu>
      </div>
      <div class="column">
        <div class="ui container">
          <table class="ui selectable small table">
            
            <tbody>
              <tr *ngFor="let t of threads">
                <td>
                  <div *ngIf="t.last_post_on > t.last_viewed || t.last_viewed == null" class="ui red ribbon label">NEW</div>
                  <a [routerLink]="['/thread', t.uuid]" class="red">{{ t.title }}</a>
                </td>
                <td class="right aligned collapsing">{{ t.last_post_on |date:"EEEE 'at' H:mm:ss a " }}</td>
                <td>{{ t.last_viewed |date:"EEEE 'at' H:mm:ss a " }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class RootComponent {

  threads = Array<Thread>();
  selected: string = 'threads';

  constructor(
    public dataService: DataService,
    public authService: AuthService) {

  }

  ngOnInit() : void {
    this.dataService.getTheads().then(threads => this.threads = threads);
  }
}