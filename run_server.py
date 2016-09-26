from tfserver import app, db

from tfserver import loadMockTasks, User, Thread, Post, UserViewedThread


db.connect()



db.drop_tables([User,Thread,Post,UserViewedThread], safe=True)
db.create_tables([User,Thread,Post,UserViewedThread])

loadMockTasks()

app.run(host='0.0.0.0')
