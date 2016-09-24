import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'user-menu',
  template: `
    
    <div class="ui secondary vertical pointing menu">
      <a class="item"
          [class.active]="selected == 'profile'"
          [routerLink]="['/user/profile']">
        <i class="User icon"></i>
        Profile
      </a>
      <a class="item"
          [class.active]="selected == 'security'"
          [routerLink]="['/user/security']">
        <i class="Lock icon"></i>
        Security
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
export class UserMenuComponent { 
  @Input() selected: string = 'none';
  
  constructor(
    public router: Router) {

    }
  

}