import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import { Cookie } from 'ng2-cookies';

import { Thread } from '../models/thread.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

import { AuthService } from './auth.service';


/**
 * Provides data access to the REST API.
 */
@Injectable()
export class DataService {
  username: string;
  password: string;
  isAuthenticated: boolean = false;
  authenticationToken: string;
  redirectUrl: string;

  private baseUrl = '/api/';
  private headers = new Headers({'Content-Type': 'application/json'});
  private authenticatedHeaders = new Headers();


  constructor(
    private http: Http,
    private router: Router,
    public authService: AuthService) { 


  }


  /**
   * Returns all the users.
   */
  getUsers(): Promise<User[]> {
    return this.http.get( (this.baseUrl + 'user/'), {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => response.json().data as User[])
                    .catch(this.handleHttpError);
  }


  /**
   * Returns all the threads in the forum.
   */
  getTheads(): Promise<Thread[]> {
    return this.http.get( (this.baseUrl + 'thread/'), {headers: this.authService.authJSONHeader})
                        .toPromise()
                        .then(response => response.json().data as Thread[])
                        .catch(this.handleHttpError);
  }

  /**
   * Returns the thread based on the ID or null if it's not found.
   * 
   * @param {string} threadUuid - The UUID of the thread.
   */
  getThread(threadUuid: string): Promise<Thread> {
    return this.http.get( (this.baseUrl + 'thread/' + threadUuid), {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => response.json().data as Thread)
                    .catch(this.handleHttpError);
  }

  /**
   * Returns all the posts for the specified thread.
   * 
   * @param {string} threadUuid - The UUID of the thread.
   * @returns {Post[]} - An array of posts.
   */
  getPosts(threadUuid: string): Promise<Array<Post>> {
    return this.http.get( (this.baseUrl + 'thread/' + threadUuid + '/post/'), {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => response.json().data as Array<Post>)
                    .catch(this.handleHttpError);
  }

  /**
   * Creats a new post on the specified thread.
   * 
   * @param {string} threadUuid - The thread to post on.
   * @param {string} content - The content to post.
   */
  createPost(threadUuid: string, content: string): Promise<Boolean> {
    return this.http.post( (this.baseUrl + 'thread/' + threadUuid + '/post/'), { content: content }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => { return true })
                    .catch(this.handleHttpError);
  }

  /**
   * Creates a new thread with one new post.
   * 
   * @param {string} title - The title of the thread.
   * @param {string} content - The content for the first post.
   */
  createThread(title: string, content: string): Promise<Boolean> {
    return this.http.post( (this.baseUrl + 'thread/'), { title: title, content: content }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => { return this.createPost(response.json().data.uuid, content)})
                    .catch(this.handleHttpError);
  }

  /**
   * Creates a new user with the provided parameters.
   * 
   * @param {string} name - The users name.
   * @param {string} password - The users password.
   * @param {string} emailAddress = The users email address.
   */
  createUser(user: User) {
    return this.http.post( (this.baseUrl + 'user/'), { name: user.name, password: user.password, email_address: user.email_address}, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => { return true })
                    .catch(this.handleHttpError);
  }

  /**
   * Gloal handler for non "successful" http responses.
   * 
   * 401 - Forces an invalidation of any auth tokens.
   */
  handleHttpError = (error: any) => {
    if(error.status == 401 ){
      // Nolonger authorized so kill the token and bail.
      this.authService.deauthenticate();
      this.router.navigate(['/login']);
      return false;
    } else {
      return false;
    }
  }
 

}