"""
Provides basic forum functionality as a RESTful api.
"""

from flask import Flask
from flask import request
from flask import jsonify

from werkzeug.security import safe_str_cmp

from functools import wraps

from enum import Enum

from peewee import SqliteDatabase, Model, CharField, DateTimeField, ForeignKeyField, TextField, BooleanField
import peewee

import jwt
import datetime
import pytz
import uuid
import logging

# Startup the logger.
logging.basicConfig(level=logging.DEBUG)
logging.getLogger('urllib3').setLevel(logging.WARNING)
logging.getLogger('peewee').setLevel(logging.WARNING)
logging.getLogger('werkzeug').setLevel(logging.INFO)
logger = logging.getLogger(__name__)

# Build the app.
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'asdlkfjasdlkj'
app.config['JWT_ALGORITHM'] = 'HS256'
app.config['DEBUG'] = True

# Build the database.
db = SqliteDatabase('./data.db', threadlocals=True)


def utc_datetime_now():
    """
    Returns a datetime object of the current time in UTC with a time zone set.
    """
    return datetime.datetime.now(pytz.utc)

def new_uuid_str():
    """
    Returns a new UUID v4 as a string.
    """
    return str(uuid.uuid4())

class BaseModel(Model):
    """
    The base model for all peewee models. Primarily used to set the database.
    """
    class Meta:
        database = db

class User(BaseModel):
    """
    Represents a user of the forum.
    """
    uuid = CharField(unique=True, default=new_uuid_str)
    name = CharField(unique=True)
    password = CharField()
    role = CharField(default="user")
    is_enabled = BooleanField(default=True)
    email_address = CharField()
    created_on = DateTimeField(default=utc_datetime_now)
    modified_on = DateTimeField(default=utc_datetime_now)


class Thread(BaseModel):
    """
    Represents a thread in the forum.
    """
    uuid = CharField(default=new_uuid_str,unique=True)
    title = CharField()
    created_on = DateTimeField(default=utc_datetime_now)
    modified_on = DateTimeField(default=utc_datetime_now)
    last_post_on = DateTimeField(default=utc_datetime_now)
    created_on = DateTimeField(default=utc_datetime_now)
    user = ForeignKeyField(User, related_name='threads')


class Post(BaseModel):
    """
    Represents a post in the forum.
    """
    uuid = CharField(default=new_uuid_str,unique=True)
    content = TextField()
    created_on = DateTimeField(default=utc_datetime_now)
    modified_on = DateTimeField(default=utc_datetime_now)
    user = user = ForeignKeyField(User)
    thread = ForeignKeyField(Thread, related_name='posts')


def loadMockTasks():
    """
    Creates mock tasks for testing.
    """
    u1 = User(name="test", password="test2", email_address="test@test.example", role="admin")
    u1.save()
    u2 = User(name="test2", password="test3", email_address="test@test.example")
    u2.save()

    t1 = Thread(title='thread 1', user=u1, email_address="test@test.example")
    t1.save()

    t2 = Thread(title='thread 2', user=u2, email_address="test@test.example")
    t2.save()

    t3 = Thread(title='thread 3', user=u1, email_address="test@test.example")
    t3.save()

    t4 = Thread(title='thread 4', user=u2, email_address="test@test.example")
    t4.save()

    p1 = Post(content="test", thread=t1, user=u1)
    p1.save()

    p1 = Post(content="test", thread=t1, user=u1)
    p1.save()

    p1 = Post(content="test", thread=t1, user=u1)
    p1.save()

    p1 = Post(content="test", thread=t1, user=u1)
    p1.save()



class ERROR_CODES(Enum):
    """
    All error codes used within the forum.
    """
    UNAUTHORIZED = 0
    NOT_LOGGED_IN = 1
    AUTHENTICATION_FAILED = 2
    NOT_FOUND = 3
    NOT_AVAILABLE = 4
    MISSING_PARAMETERS = 5


    def __str__(self):
        return(self.name)

def create_error_response(error_message, error_code):
    """ Creates a standard error response used by all REST apis.
    """
    return {
        'meta': {
            'error': True,
            'error_message': error_message,
            'error_code': str(error_code)
        }
    }

def create_success_response(return_data):
    """ Creates a standard success response used by all REST apis.
    """
    count = 1
    if type(return_data) is list:
        count = len(return_data)

    return {
        'meta': {
            'error': False,
            'count': count
        },
        'data': return_data
    }

def create_token_from_user(user):
    """ Creates a new JWT token based on the user account.
    """
    return jwt.encode( {'user_uuid': str(user.uuid)}, app.config['JWT_SECRET_KEY'], app.config['JWT_ALGORITHM']).decode("utf-8")

def token_authenticate(token):
    """
        Validates the token and returns the user is the token is valid. None otherwise.
    """
    if token is not None:
        try:
            token = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithm=app.config['JWT_ALGORITHM'] )
            u = User.get(User.uuid == token['user_uuid'])
            return u
        except User.DoesNotExist:
            logger.info("REQUEST REJECTED FROM %s - UNKNOWN_USER_IN_TOKEN." % request.remote_addr)
            pass
        except NameError:
            pass
        except jwt.exceptions.DecodeError:
            pass
    else:
        logger.info("REQUEST REJECTED FROM %s - NO TOKEN FOUND." % request.remote_addr)

    return None


def require_jwt_authenticate(f):
    """
    Validates if the provided token is valid, if so it sets the users id.
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        u = token_authenticate(request.headers.get('the_forum_token'))
        if u:
            return f(u.uuid, *args, **kwargs)
        else:
            return_data = create_error_response("No authorized and valid tokens were provided.", ERROR_CODES.NOT_LOGGED_IN)
            return(jsonify(return_data), 401)
    return wrapper

## TODO
def hash_password(password):
    return password

@app.route('/api/auth/', methods=['POST', 'GET'])
def r_auth():

    if request.method == 'POST':
        request.get_json(force=True)
        data = request.json

        try:
            u = User.get(User.name == data['username'])
            if u.password == hash_password(data['password']):
                #new_token = jwt.encode( {'user_uuid': str(u.uuid)}, app.config['JWT_SECRET_KEY'], app.config['JWT_ALGORITHM']).decode("utf-8")
                new_token = create_token_from_user(u)
                return_data = create_success_response({
                    "the_forum_token": new_token,
                    "user": {
                        'name': u.name,
                        'uuid': u.uuid,
                        'role': u.role}
                        })
                logging.warning("LOGIN SUCCESS FOR %s FROM %s" % (u.name, request.remote_addr))
                return(jsonify(return_data))
        except User.DoesNotExist:
            pass
        except NameError:
            pass
        except DecodeError:
            pass

        logging.warning("LOGIN FAILURE FOR %s FROM %s" % (data['username'], request.remote_addr) )
        return_data = create_error_response("Failed to authentication with provided credentials", ERROR_CODES.AUTHENTICATION_FAILED)
        return(jsonify(return_data), 401)

    if request.method == 'GET':
        u = token_authenticate(request.headers.get('the_forum_token'))
        if u:
            new_token = create_token_from_user(u)
            return_data = create_success_response({
                "the_forum_token": new_token,
                "user": {
                    'name': u.name,
                    'uuid': u.uuid,
                    'role': u.role}
                    })
            logging.warning("RELOGIN SUCCESS FOR %s FROM %s" % (u.name, request.remote_addr))
            return(jsonify(return_data))
        else:
            logging.warning("RELOGIN FAILURE FROM %s" % (request.remote_addr) )
            return_data = create_error_response("Failed to authentication with provided credentials", ERROR_CODES.AUTHENTICATION_FAILED)
            return(jsonify(return_data), 401)


@app.route('/api/thread/', methods=['GET','POST'])
@require_jwt_authenticate
def r_thread(user_uuid):

    if request.method == 'GET':
        return_threads = []
        for t in Thread.select().join(User).order_by(Thread.modified_on.desc()):
            return_threads.append({
                'title': t.title,
                'uuid': t.uuid,
                'created_on': t.created_on,
                'modified_on': t.modified_on,
                'last_post_on': t.last_post_on,
                'username': t.user.name,
                'user_uuid': t.user.uuid
            })

        return_data = create_success_response(return_threads)
        return(jsonify(return_data), 200)

    if request.method == 'POST':
        request.get_json(force=True)
        data = request.json

        u = User.get(User.name == 'test')
        t = Thread(title=data['title'], user=u)
        t.save()
        return_data = create_success_response({
                'title': t.title,
                'uuid': t.uuid,
                'created_on': t.created_on,
                'modified_on': t.modified_on,
                'last_post_on': t.last_post_on,
                'username': t.user.name,
                'user_uuid': t.user.uuid
            })
        return(jsonify(return_data), 200)

@app.route('/api/thread/<string:thread_uuid>', methods=['GET', 'DELETE'])
@require_jwt_authenticate
def r_thread_id(user_uuid, thread_uuid=None):



    try:
        t = Thread.get(Thread.uuid == thread_uuid)
    except Thread.DoesNotExist:
        return_data = create_error_response('Could not find thread with id of %s' % thread_uuid, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':
        return_thread = {

            'title': t.title,
            'uuid': t.uuid,
            'created_on': t.created_on,
            'modified_on': t.modified_on,
            'last_post_on': t.last_post_on,
            'username': t.user.name,
            'user_uuid': t.user.uuid
        }
        return_data = create_success_response(return_thread)
        return(jsonify(return_data), 200)

    if request.method == 'DELETE':
        t.delete_instance(recursive=True)
        return_data = create_success_response([])
        return(jsonify(return_data), 200)

@app.route('/api/thread/<string:thread_uuid>/post/', methods=['GET','POST'])
@require_jwt_authenticate
def r_thread_post(user_uuid, thread_uuid):
    try:
        t = Thread.get(Thread.uuid == thread_uuid)
    except Thread.DoesNotExist:
        return_data = create_error_response('Could not find thread with id of %s' % thread_uuid, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':
        return_posts = []
        for p in Post.select().join(User).where(Post.thread == t).order_by(Post.created_on.asc()):
            return_posts.append({
                'uuid': p.uuid,
                'content': p.content,
                'created_on': p.created_on,
                'modified_on': p.modified_on,
                'user': p.user.name
            })
        return_data = create_success_response(return_posts)
        return(jsonify(return_data), 200)

    if request.method == 'POST':
        request.get_json(force=True)
        data = request.json
        u = User.get(User.uuid == user_uuid)
        p = Post(content = data['content'], user = u, thread = t)
        p.save()
        t.last_post_on = utc_datetime_now()
        t.save()
        return_data = create_success_response([])
        return(jsonify(return_data), 200)

@app.route('/api/post/<string:post_uuid>', methods=['GET', 'DELETE', 'PUT'])
@require_jwt_authenticate
def r_post(user_uuid, post_uuid):
    try:
        p = Post.get(Post.uuid == post_uuid)
    except Post.DoesNotExist:
        return_data = create_error_response('Could not find post with id of %s' % post_uuid, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':
        return_post = {
            'uuid': p.uuid,
            'content': p.content,
            'created_on': p.created_on,
            'modified_on': p.modified_on,
            'username': p.user.name,
            'user_uuid': p.user.uuid
        }
        return_data = create_success_response(return_post)
        return(jsonify(return_data), 200)

    if request.method == 'DELETE':
        p.delete_instance()
        return_data = create_error_response([])
        return(jsonify(return_data), 200)

    if request.method == 'PUT':
        if(p.user.uuid == user_uuid):
            request.get_json(force=True)
            data = request.json
            p.content = data['content']
            p.modified_on = utc_datetime_now()
            p.save()
            return_data = create_success_response([])
            return(jsonify(return_data), 200)
        else:
            return_data = create_error_response('User does not have permissions to edit the post to edit the post.', ERROR_CODES.UNAUTHORIZED)
            return(jsonify(return_data), 401)

@app.route('/api/user/', methods=['GET', 'POST'])
@require_jwt_authenticate
def r_user(user_uuid):

    if request.method == 'GET':

        return_users = []
        for u in User.select().order_by(User.name):
            return_users.append({
                'name': u.name,
                'uuid': u.uuid,
                'role': u.role,
                'email_address': u.email_address,
                'created_on': u.created_on,
                'modified_on': u.modified_on
            })
        return_data = create_success_response(return_users)
        return(jsonify(return_data), 200)

    if request.method == 'POST':
        request.get_json(force=True)
        data = request.json


        try:
            with db.atomic():
                User.create(name=data['name'], password=hash_password(data['password']), email_address=data['email_address'])

                return_data = create_success_response([])
                return(jsonify(return_data), 200)
        except peewee.IntegrityError:
            return_data = create_error_response('The username is not available', ERROR_CODES.NOT_AVAILABLE)
            return(jsonify(return_data), 422)
        except KeyError:
            return_data = create_error_response('Missing a required parameter.', ERROR_CODES.MISSING_PARAMETERS)
            return(jsonify(return_data), 422)

@app.route('/api/user/<string:managed_user_uuid>', methods=['GET', 'DELETE'])
@require_jwt_authenticate
def r_user_id(user_uuid, managed_user_uuid=None):

    try:
        u = User.get(User.uuid == managed_user_uuid)
    except User.DoesNotExist:
        return_data = create_error_response('Could not find user with id of %s' % managed_user_uuid, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':
        return_user = {
            'name': u.name,
            'uuid': u.uuid,
            'role': u.role,
            'email_address': u.email_address,
            'created_on': u.created_on,
            'modified_on': u.modified_on
        }
        return_data = create_success_response(return_user)
        return(jsonify(return_data), 200)

    if request.method == 'DELETE':
        u.delete_instance(recursive=True)
        return_data = create_success_response([])
        return(jsonify(return_data), 200)

