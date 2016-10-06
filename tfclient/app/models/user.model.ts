export class User {
  id: string;
  name: string;
  password: string;
  role: string = 'user';
  email_address: string;
  is_enabled: boolean;
  created_on: Date;
  modified_on: Date;
  post_count: number;
  thread_count: number;
  notify_on_new_thread: boolean;
  notify_on_new_post: boolean;
  
}