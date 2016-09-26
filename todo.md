
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

#### TODO




* [core] Remove uuids as they are not really used due a misunderstanding of peewee.

* [admin] Validate input on new user add.
* [admin] Control role on user add.
* [auth] Require user to be "enabled".
* [admin] Control if user is enabled.
* [admin] Allow user editing.
* [admin] Allow user deleting. (Cannot delete self, validate on both server and client.)
* [admin] Sort use list by name.

* [auth] Allow users to register.
* [auth] Require user to validate email address.

* [security] Revisit input bleaching on everythign like username. 

* [thread] Thread list pagination
* [thread] Threads should sort bylast update. 


* [deploy] Deployment Documentation
* [deploy] Generate production ready Angular2.
* [deploy] Restructure tfserver to allow direct running or uwsgi
* [deploy] Provide default uwsgi ini file.
* [deploy] Provide sample nginx file.



* [admin] Backup exports.

#### Future Imporovements
* [general] Use a guard on routes to pre-load data.
* [auth] Token timeout and refresh management.
* [operations] Setup script to run with command options.
* [config] Load configuration from file.



# ToDo

* RESOVLE GUARD To wait for loading.


* [admin] Delete user that is not self.
* [admin] Disable user.
* [auth] Validate user is valid _and_ enabled.
* [auth] Use time expiring tokens.
* [auth] Allow token rejection.
* [admin] Add two levels. (admin & user).
* [thread-view] Delete current thread if owner or admin.
* [thread-view] Delete post if owner or admin.
* [thread-view] Fix look and feel of posts.
* [thread-view] Allow avatars
* [thread-view] Allow editing of thread title.
* [thread-view] Thread stickies.
* [new-thread] Tab between fields.
* [new-thread] Ctrl-enter submit.
* [new-thread] Validate not empty and notify the user.
* [new-thread] Not allow navigation away if started thread.
* [thread-view] Not allow navigation away if started post.
* [searching] Allow it, duh.
* [auth] User validation via email.


Load guard on change.


[theard-list] Denote threads that have posts new to the user.
[thread-list] Threads should list both last update and created dates.
[thread-list]
