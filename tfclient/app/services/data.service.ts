import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import { Cookie } from 'ng2-cookies';

import { Thread } from '../models/thread.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { ResponseMetaData } from '../models/response-meta-data.model';
import { TFSettings } from '../models/tf-settings.model';
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
   * Returns the data for one user.
   */
  getUser(user_id): Promise<User> {
    return this.http.get( (this.baseUrl + 'user/' + user_id ), {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => response.json().data as User)
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
   * @param {string} threadId - The Id of the thread.
   */
  getThread(threadId: string): Promise<Thread> {
    return this.http.get( (this.baseUrl + 'thread/' + threadId), {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => response.json().data as Thread)
                    .catch(this.handleHttpError);
  }

  /**
   * Returns all the posts for the specified thread.
   * 
   * @param {string} threadId - The Id of the thread.
   * @returns {Post[]} - An array of posts.
   */
  getPosts(threadId: string): Promise<Array<Post>> {
    return this.http.get( (this.baseUrl + 'thread/' + threadId + '/post/'), {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => response.json().data as Array<Post>)
                    .catch(this.handleHttpError);
  }

  /**
   * Creats a new post on the specified thread.
   * 
   * @param {string} threadId - The thread to post on.
   * @param {string} content - The content to post.
   */
  createPost(threadId: string, content: string): Promise<Boolean> {
    return this.http.post( (this.baseUrl + 'thread/' + threadId + '/post/'), { content: content }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => { return true })
                    .catch(this.handleHttpError);
  }

  /**
   * Deletes the post from the system.
   * 
   * @param {Post} post - The post to delete.
   */
  deletePost(post: Post): Promise<Boolean> {
    return this.http.delete( (this.baseUrl + 'post/' + post.id), { headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => { return true })
                    .catch(this.handleHttpError);
  }

  /**
   * Updates a posts content.
   * 
   * @param {string} postId - The ID of the post.
   * @param {string} content - The new content of the post.
   */
  updatePost(postId: string, content: string): Promise<Boolean> {
    return this.http.put( (this.baseUrl + 'post/' + postId), { content: content }, { headers: this.authService.authJSONHeader})
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
  createThread(title: string, content: string): Promise<ResponseMetaData> {
    return this.http.post( (this.baseUrl + 'thread/'), { title: title, content: content }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => { return response.json().meta as ResponseMetaData })
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
    return this.http.post( (this.baseUrl + 'user/'), user, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => { return true })
                    .catch(this.handleHttpError);
  }

  /**
   * Requests the user password to be changed.
   * 
   * @param {User} user - The user to change the password of.
   * @param {string} password - The password to change to.
   */
  changeUserPassword(user: User, password: string) {
    return this.http.put( (this.baseUrl + 'user/' + user.id), { password: password }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => {
                      if(response.json().meta.error) {
                        return false;
                      } else {
                        return true;
                      }
                    }).catch(this.handleHttpError);
  }

  /**
   * Requests the users name to changed.
   * 
   * @param {User} user - The user to change the name of.
   * @param {string} name - The name to change to.
   * 
   */
  changeUserName(user: User, name: string): Promise<ResponseMetaData> {
    return this.http.put( (this.baseUrl + 'user/' + user.id), { name: name }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => {
                      return response.json().meta as ResponseMetaData;
                      // if(response.json().meta.error) {
                      //   return false;
                      // } else {
                      //   return true;
                      // }
                    }).catch(this.handleHttpError);
  }

  /**
   * Enables/Disables a user.
   * 
   * @param {User} user - The user to enable/disable.
   * @param {boolean} is_enabled - If they should be enabled or not.
   */
  enableUser(user: User, is_enabled: boolean): Promise<ResponseMetaData> {
    return this.http.put( (this.baseUrl + 'user/' + user.id), { is_enabled: is_enabled }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => {
                      return response.json().meta as ResponseMetaData;
                    }).catch(this.handleHttpError);
  }

  enableNotifyNewThread(user: User, notify_on_new_thread: boolean): Promise<ResponseMetaData> {
    return this.http.put( (this.baseUrl + 'user/' + user.id), { notify_on_new_thread: notify_on_new_thread }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => {
                      return response.json().meta as ResponseMetaData;
                    }).catch(this.handleHttpError);
  }

  enableNotifyNewPost(user: User, notify_on_new_post: boolean): Promise<ResponseMetaData> {
    return this.http.put( (this.baseUrl + 'user/' + user.id), { notify_on_new_post: notify_on_new_post }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => {
                      return response.json().meta as ResponseMetaData;
                    }).catch(this.handleHttpError);
  }

  changeUserRole(user: User, role: string): Promise<ResponseMetaData> {
    return this.http.put( (this.baseUrl + 'user/' + user.id), { role: role }, {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => {
                      return response.json().meta as ResponseMetaData;
                    }).catch(this.handleHttpError);
  }

  getTFSettings(): Promise<TFSettings> {
    return this.http.get( (this.baseUrl + 'setting/'), {headers: this.authService.authJSONHeader})
                    .toPromise()
                    .then(response => {
                      return response.json().data as TFSettings
                    })
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