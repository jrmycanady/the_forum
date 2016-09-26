import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import { Cookie } from 'ng2-cookies';

import { User } from '../models/user.model';

@Injectable()
/**
 * Provides authentication services for access to the API.
 */
export class AuthService {

  private authUrl: string = '/api/auth/';
  isAuthenticated: boolean = false;
  authToken: string;
  authJSONHeader: Headers;
  user: User = new User();

  constructor(
    private http: Http,
    private router: Router) { }

  /**
   * Attemps to autheticate with the REST API.
   * 
   * @param {string} username - The username to authenticate with.
   * @param {string} password - The password to autehticate with.
   * @return {Promise<boolean>} - The result of the authentication attempt.
   */
  authenticate(username: string, password: string): Promise<boolean> {

    let creds = {
      username: username,
      password: password
    }
    return this.http.post(this.authUrl, JSON.stringify(creds))
                    .toPromise()
                    .then(this.processSuccessfulAuthentication)
                    .catch(response => { return false });
  }

  /**
   * Processes the successful autentication request.
   */
  processSuccessfulAuthentication = (response) => {

    this.setAuthenticated(response.json().data.the_forum_token, response.json().data.user);
    Cookie.set('the_forum_token', this.authToken, 30);

    return true;
  }

  /**
   * Removes all authentication. 
   */
  deauthenticate() {
    Cookie.delete('the_forum_token');
    this.isAuthenticated = false;
    this.authToken = null;
    this.user = new User();
    
  }

  /**
   * Sets the authentiation with the provided token.
   * 
   * @param {string} token - The token to be used for authentication.
   */
  setAuthenticated(token: string, user: any) {
    this.isAuthenticated = true;
    this.authToken = token
    this.authJSONHeader = new Headers({
      'Content-Type': 'application/json',
      'the_forum_token': this.authToken
    })
    this.user = new User();
    this.user.name = user.name;
    this.user.id = user.id;
    this.user.role = user.role;
  }

  /**
   * If a token is not present an attempt to load one from a cookie is tried.
   */
  loadAndValidateToken() {
    if(!this.authToken)
    {
      let c = Cookie.get('the_forum_token');
      if(c) {

        // Attempt to load user settings using the cookie.
        this.setAuthenticated(c, {'id': 'id', 'name': 'name', 'role': 'role'});
      }
    }
  }

  /**
   * Authenticates using the token saved in the cookie.
   * 
   * This is used to validate the cookie token is valid and to collect
   * user information for the token. Additionally it could eventualy be
   * used to re-authenticate tokens that may expire soon. The backend
   * API already re-issues a new token.
   */
  authenticateFromToken(): Promise<boolean> | boolean {

    if(!this.authToken) {

      // No tokens found so try cookies.
      let c = Cookie.get('the_forum_token')
      if(c) {

        // Cookie found so test it out.
        let tempHeader = new Headers({
          'Content-Type': 'application/json',
          'the_forum_token': c
        });
        return this.http.get(this.authUrl, {headers: tempHeader})
                 .toPromise()
                 .then(this.processSuccessfulAuthentication) // Auth succeeded.
                 .catch(this.handleFailedAuthRequest) // Auth failed.
      }
      else {
        // The cookie was not found so fail because we have no token.
        this.router.navigate(['/login']);
        return false;
      }
    }
    else {
      // A token was found so re-auth it.
      let tempHeader = new Headers({
          'Content-Type': 'application/json',
          'the_forum_token': this.authToken
        });
      return this.http.get(this.authUrl, {headers: tempHeader})
                .toPromise()
                .then(this.handleFailedAuthRequest) // Auth failed.
    }

  }

  /**
   * Handles a failed HTTP request to /auth/ by redirecting to the login page
   * and deauthenticating the service.
   */
  handleFailedAuthRequest = (response) => {
    this.deauthenticate(); 
    this.router.navigate(['/login']);
    return false;
  }



}