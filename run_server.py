from tfserver import app, db

from tfserver import loadMockTasks, User, Thread, Post


db.connect()



db.drop_tables([User,Thread,Post], safe=True)
db.create_tables([User,Thread,Post])

loadMockTasks()

app.run(host='0.0.0.0')
