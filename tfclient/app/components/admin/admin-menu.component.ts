import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-menu',
  template: `
    
    <div class="ui secondary vertical pointing menu">
      <a class="item"
          [class.active]="selected == 'users'"
          [routerLink]="['/admin/users']">
        <i class="Users icon"></i>
        Users
      </a>
      <a class="disabled item">
        <i class="Settings icon"></i>
        Settings
      </a>
      <a class="disabled item">
        <i class="Bar Chart icon"></i>
        Stats
      </a>
    </div>
          
  `
})
export class AdminMenuComponent { 
  @Input() selected: string = 'none';
  
  constructor(
    public router: Router) {

    }
  

}