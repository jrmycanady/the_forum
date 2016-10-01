export class TFSettings {
  general_forum_title: string;
  jwt_key: string = "******";
  jwt_use_db_key: boolean;
  email_notifications_thread_enabled: boolean;
  email_notifications_posts_enabled: boolean;
  email_notification_from_address: string;
  email_notifications_thread_subject_template: string;
  email_notifications_post_subject_template: string;
}