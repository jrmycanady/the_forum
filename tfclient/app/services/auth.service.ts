import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Cookie } from 'ng2-cookies';

@Injectable()
/**
 * Provides authentication services for access to the API.
 */
export class AuthService {

  private authUrl: string = '/api/auth/';
  isAuthenticated: boolean = false;
  authToken: string;
  authJSONHeader: Headers;

  constructor(
    private http: Http) {


  }


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
    this.setAuthenticated(response.json().data.the_forum_token);
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
  }

  /**
   * Sets the authentiation with the provided token.
   * 
   * @param {string} token - The token to be used for authentication.
   */
  setAuthenticated(token: string) {
    this.isAuthenticated = true;
    this.authToken = token
    this.authJSONHeader = new Headers({
      'Content-Type': 'application/json',
      'the_forum_token': this.authToken
    })
  }

  /**
   * If a token is not present an attempt to load one from a cookie is tried.
   */
  loadAndValidateToken() {
    if(!this.authToken)
    {
      let c = Cookie.get('the_forum_token');
      if(c) {
        this.setAuthenticated(c);
      }
    }
  }



}