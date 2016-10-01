
#### Completed
* [auth] Handles long term tokens.
* [auth] Provide logout function on menu item.
* [admin] Basic admin component.
* [admin] View current users.
* [admin] Create new basic user.
* [auth] Hash user passwords.
* [user-settings] Allow users to change password.
* [polish] Post buttons are not attached as they should be.
* [user-settings] Allow users to change name.
* [post] Sanatize input with bleach
* [post] Allow markdown posts.
* [post] Posts do not handle any markup like returns and such. Need to get that fixed.
* [bug] New thread submits without post fail but still submit. - Probably need to make the thread add API expect a content value too.
* [bug] New threads are marked new for the submitter.
* [core] Remove uuids as they are not really used due a misunderstanding of peewee.
* [thread] Threads should sort bylast update. 
* [thread-view] Fix look and feel of posts.
* [post] Allow post editing by user.
* [post] Allow post deletion by user.

#### TODO

* [post] Do no submit empty posts.
* [post] Ghost post instead of actually deleting it.
* [post] Markdown preview
* [post] Markdown help menu.
* [post] Markdown link button.
* [thread-view] Update date to change if a week old.
* [new-thread] Tab navigation between thread title and first post.
* [new-thread] Markdown preview.
* [new-thread] Markdown help menu.
* [new-thread] Markdown link button.
* [stats] Track posts per user.
* [stats] Track threads per user.
* [user] Add user "join" date.
* [user] Add "enabled" option to user account. 
* [notification] Allow users to be notified on new posts to viewed threads.
* [notification] Allow users to be notifeid on new threads.
* [general] Button disabling on REST calls. (Prevent double submit, etc.)

* [post] Add error notifications. (No empty post, etc.)

* [admin] Validate input on new user add.
* [admin] Control role on user add.
* [auth] Require user to be "enabled".
* [admin] Control if user is enabled.
* [admin] Allow user editing.
* [admin] Allow user deleting. (Cannot delete self, validate on both server and client.)
* [admin] Sort use list by name.
* [auth] Allow token rejection.
* [auth] Allow users to register.
* [auth] Require user to validate email address.
* [security] Revisit input bleaching on everythign like username. 
* [thread] Thread list pagination
* [deploy] Deployment Documentation
* [deploy] Generate production ready Angular2.
* [deploy] Restructure tfserver to allow direct running or uwsgi
* [deploy] Provide default uwsgi ini file.
* [deploy] Provide sample nginx file.
* [admin] Backup exports.
* [general] Use a guard on routes to pre-load data.
* [auth] Token timeout and refresh management.
* [config] Load configuration from file.
* [thread-view] Delete current thread if owner or admin.
* [thread-view] Delete post if owner or admin.
* [thread-view] Allow avatars
* [thread-view] Allow editing of thread title.
* [thread-view] Thread stickies.
* [new-thread] Tab between fields.
* [new-thread] Ctrl-enter submit.
* [new-thread] Not allow navigation away if started thread.
* [thread-view] Not allow navigation away if started post.
* [searching] Allow it, duh.
* [auth] User validation via email.
