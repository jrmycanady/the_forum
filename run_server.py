from tfserver import app, db, safe_build_settings

from tfserver import load_mock_tasks, User, Thread, Post, UserViewedThread, TFSettings


db.connect()



db.drop_tables([User,Thread,Post,UserViewedThread,TFSettings], safe=True)
db.create_tables([User,Thread,Post,UserViewedThread,TFSettings])
safe_build_settings()
load_mock_tasks()

app.run(host='0.0.0.0')
