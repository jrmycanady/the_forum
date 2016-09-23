import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';



import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';


@Injectable()
export class CanActivateViaAuthenticated implements CanActivate {

  constructor(
    public authService: AuthService,
    private router: Router) {

  }

  /**
   * Save the state url before checking if they are authorized.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    let url: string = state.url;

    return this.checkAuthorization(url);
    
  }

  checkAuthorization(url: string): boolean {
    // First run a check to load any tokens.
    this.authService.loadAndValidateToken();

    if (this.authService.isAuthenticated) {
      return true;
    }

    // this.dataService.redirectUrl = url;

    this.router.navigate(['/login']);
    return false;
  }


}