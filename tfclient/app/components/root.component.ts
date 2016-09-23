import { Component, Input } from '@angular/core';

import { DataService } from '../services/data.service';
import { Thread } from '../models/thread.model';
import { TopMenuComponent } from './top-menu.component';

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
                <td class="collapsing"><i class="Radio icon"></i></td>
                <td><a [routerLink]="['/thread', t.uuid]" class="red">{{ t.title }}</a></td>
                <td class="right aligned collapsing">{{ t.created_on |date:"yyyy.MM.dd hh:mm:ss" }}</td>
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

  constructor(public dataService: DataService) {

  }

  ngOnInit() : void {
    this.dataService.getTheads().then(threads => this.threads = threads);
  }
}