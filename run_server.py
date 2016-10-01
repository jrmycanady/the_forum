from tfserver import app, db, safeBuildSettings

from tfserver import loadMockTasks, User, Thread, Post, UserViewedThread, TFSettings


db.connect()



db.drop_tables([User,Thread,Post,UserViewedThread,TFSettings], safe=True)
db.create_tables([User,Thread,Post,UserViewedThread,TFSettings])
safeBuildSettings()
loadMockTasks()

app.run(host='0.0.0.0')
