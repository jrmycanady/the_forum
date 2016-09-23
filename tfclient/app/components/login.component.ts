import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login-form',
  template: `
    
    <div class="ui middle aligned center aligned grid" style="height: 100%">
      <div class="column" style="max-width: 450px;">
        <h2 class="ui red header">
          The Forum
          
        </h2>
        <form class="ui large form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="ui segment">
            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input type="text" 
                       name="username" 
                       placeholder="username"
                       autofocus
                       [(ngModel)]="username"
                       (keyup)="updateSubmitButton()">
              </div>
            </div>
            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" 
                       name="password" 
                       placeholder="Password"
                       [(ngModel)]="password"
                       (keyup)="updateSubmitButton()">
              </div>
            </div>
            <div class="ui fluid large red submit button"
                 (click)="onSubmit()"
                 [class.disabled]="submitIsDisabled == true">Login</div>
          </div>
          
          <button hidden type="submit">Test</button>

        </form>
          <div class="ui error message" [class.hidden]="showError == false">
            {{ errorMsg }}
          </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  submitIsDisabled: boolean = true;
  submitted: boolean = false;
  showError: boolean = false;
  errorMsg: string = '';

  constructor(
    public dataService: DataService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {}

  /**
   * Processes a login attempt.
   */
  onSubmit(): void {

    
    this.authService.authenticate(this.username, this.password).then(this.processAuthenticationResult);
    
  }

  /**
   * Processes authetication request results.
   * 
   */
  processAuthenticationResult = (response) => {
    if(response) {
      this.router.navigate(['/']);
    }
    else {
      this.errorMsg = 'Failed Login';
      this.showError = true;
    }
  }

  /**
   * Updates the login button as needed based on input parameters.
   */
  updateSubmitButton() {
   
    if(this.username.length > 0 && this.password.length > 0) {
      this.submitIsDisabled = false;
    }
    else {
      this.submitIsDisabled = true;
    }
  }

}