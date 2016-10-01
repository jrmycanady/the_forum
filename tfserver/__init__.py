"""
Provides basic forum functionality as a RESTful api.
"""

from flask import Flask
from flask import request
from flask import jsonify

from werkzeug.security import safe_str_cmp

from functools import wraps

from enum import Enum

from argon2 import PasswordHasher
import argon2

from peewee import SqliteDatabase, Model, CharField, DateTimeField, ForeignKeyField, TextField, BooleanField, BigIntegerField
from peewee import JOIN
from peewee import SQL
import peewee

import jwt
import datetime
import pytz
#import uuid
import logging
import bleach

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

# Global argon2 password hasher.
ph = PasswordHasher()

def sanitize_markdown_input(input):
    return bleach.clean(input, tags=[], attributes={}, styles=[], strip=True)

def hash_password(password):
    """ Hashes the password using the proper algorithm.
    """
    return ph.hash(password)

def validate_hashed_password(hash, password):
    """ Validates the hashed password matches the password.
    """
    try:
        ph.verify(hash, password)
        return True
    except argon2.exceptions.VerifyMismatchError:
        pass
    except argon2.exceptions.VerificationError:
        pass

    return False

def utc_datetime_now():
    """
    Returns a datetime object of the current time in UTC with a time zone set.
    """
    return datetime.datetime.now(pytz.utc)

# def new_uuid_str():
#     """
#     Returns a new UUID v4 as a string.
#     """
#     return str(uuid.uuid4())

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
    name = CharField(unique=True)
    password = CharField()
    role = CharField(default="user")
    is_enabled = BooleanField(default=True)
    email_address = CharField()
    created_on = DateTimeField(default=utc_datetime_now)
    modified_on = DateTimeField(default=utc_datetime_now)
    post_count = BigIntegerField(default=0)
    thread_count = BigIntegerField(default=0)

    def sanitized_update(self, name, email_address):
        self.name = sanitize_markdown_input(name)
        self.email_address = sanitize_markdown_input(email_address)


class Thread(BaseModel):
    """
    Represents a thread in the forum.
    """

    title = CharField()
    created_on = DateTimeField(default=utc_datetime_now)
    modified_on = DateTimeField(default=utc_datetime_now)
    last_post_on = DateTimeField(default=utc_datetime_now)
    created_on = DateTimeField(default=utc_datetime_now)
    user = ForeignKeyField(User, related_name='threads')
    post_count = BigIntegerField(default=0)
    viewed_count = BigIntegerField(default=0)

    def sanitized_update(self, title):
        self.title = sanitize_markdown_input(title)


class Post(BaseModel):
    """
    Represents a post in the forum.
    """

    content = TextField()
    created_on = DateTimeField(default=utc_datetime_now)
    modified_on = DateTimeField(default=utc_datetime_now)
    user = user = ForeignKeyField(User)
    thread = ForeignKeyField(Thread, related_name='posts')

    def sanitized_update(self, content):
        self.content = sanitize_markdown_input(content)

class UserViewedThread(BaseModel):
    user = ForeignKeyField(User)
    thread = ForeignKeyField(Thread)
    last_viewed = DateTimeField(default=utc_datetime_now)



def loadMockTasks():
    """
    Creates mock tasks for testing.
    """
    u1 = User(name="test", password=hash_password("test2"), email_address="test@test.example", role="admin")
    u1.save()
    u2 = User(name="test2", password=hash_password("test3"), email_address="test@test.example")
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
    REQUEST_NOT_FULFILLED = 6
    MINIMUM_LENGTH_NOT_MET = 7
    PARAMETER_NOT_UNIQUE = 8



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
    return jwt.encode( {'user_id': str(user.id)}, app.config['JWT_SECRET_KEY'], app.config['JWT_ALGORITHM']).decode("utf-8")

def token_authenticate(token):
    """
        Validates the token and returns the user is the token is valid. None otherwise.
    """
    if token is not None:
        try:
            token = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithm=app.config['JWT_ALGORITHM'] )
            u = User.get(User.id == token['user_id'])
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
            return f(u.id, *args, **kwargs)
        else:
            return_data = create_error_response("No authorized and valid tokens were provided.", ERROR_CODES.NOT_LOGGED_IN)
            return(jsonify(return_data), 401)
    return wrapper



@app.route('/api/auth/', methods=['POST', 'GET'])
def r_auth():

    if request.method == 'POST':
        request.get_json(force=True)
        data = request.json

        try:
            u = User.get(User.name == data['username'])
            # if u.password == hash_password(data['password']):
            #if ph.verify(u.password, data['password']):
            if validate_hashed_password(u.password, data['password']):
                #new_token = jwt.encode( {'user_id': str(u.id)}, app.config['JWT_SECRET_KEY'], app.config['JWT_ALGORITHM']).decode("utf-8")
                new_token = create_token_from_user(u)
                return_data = create_success_response({
                    "the_forum_token": new_token,
                    "user": {
                        'name': u.name,
                        'id': u.id,
                        'role': u.role}
                        })
                logging.warning("LOGIN SUCCESS FOR %s FROM %s" % (u.name, request.remote_addr))
                return(jsonify(return_data))
        except User.DoesNotExist:
            pass
        except NameError:
            pass
        except jwt.exceptions.DecodeError:
            pass
        except argon2.exceptions.VerifyMismatchError:
            pass
        except argon2.exceptions.VerificationError:
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
                    'id': u.id,
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
def r_thread(user_id):

    if request.method == 'GET':
        u = User.get(User.id == user_id)

        return_threads = []
        # Get only the users viewedthreads.
        q1 = UserViewedThread.select(UserViewedThread.thread_id, UserViewedThread.id, UserViewedThread.user_id, UserViewedThread.last_viewed).where(UserViewedThread.user == u).alias('q1')
        # Join iwth all views to get info needed.
        q2 = Thread.select(Thread.id, Thread.title, Thread.modified_on, Thread.last_post_on, Thread.created_on, Thread.user_id, SQL("q1.last_viewed"), User.name).join(User).join(q1, JOIN.LEFT_OUTER, on=(Thread.id == q1.c.thread_id)).order_by(Thread.modified_on.desc()).dicts()

        
        for t in q2:
            return_threads.append({
                'title': t['title'],
                'id': t['id'],
                'created_on': t['created_on'],
                'modified_on': t['modified_on'],
                'last_post_on': t['last_post_on'],
                'username': t['name'],
                #'user_id': t['user_id'],
                'last_viewed': t['last_viewed']
            })


        return_data = create_success_response(return_threads)
        return(jsonify(return_data), 200)

    if request.method == 'POST':
        request.get_json(force=True)
        data = request.json

        # Create thread and post then save a view for the submitting user.
        u = User.get(User.id == user_id)
        t = Thread(user=u)
        t.sanitized_update(title=data['title'])
        
        t.save()
        p = Post(user=u, content=data['content'], thread=t)
        p.save()

        uvt = UserViewedThread(user = u, thread = t)        
        uvt.last_viewed = utc_datetime_now()
        uvt.save()

        return_data = create_success_response({
                'title': t.title,
                'id': t.id,
                'created_on': t.created_on,
                'modified_on': t.modified_on,
                'last_post_on': t.last_post_on,
                'username': t.user.name,
                'user_id': t.user.id
            })
        return(jsonify(return_data), 200)

@app.route('/api/thread/<string:thread_id>', methods=['GET', 'DELETE'])
@require_jwt_authenticate
def r_thread_id(user_id, thread_id=None):



    try:
        t = Thread.get(Thread.id == thread_id)
    except Thread.DoesNotExist:
        return_data = create_error_response('Could not find thread with id of %s' % thread_id, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':
        return_thread = {

            'title': t.title,
            'id': t.id,
            'created_on': t.created_on,
            'modified_on': t.modified_on,
            'last_post_on': t.last_post_on,
            'username': t.user.name,
            'user_id': t.user.id
        }
        return_data = create_success_response(return_thread)
        return(jsonify(return_data), 200)

    if request.method == 'DELETE':
        t.delete_instance(recursive=True)
        return_data = create_success_response([])
        return(jsonify(return_data), 200)

@app.route('/api/thread/<string:thread_id>/post/', methods=['GET','POST'])
@require_jwt_authenticate
def r_thread_post(user_id, thread_id):
    try:
        t = Thread.get(Thread.id == thread_id)
    except Thread.DoesNotExist:
        return_data = create_error_response('Could not find thread with id of %s' % thread_id, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':

        # The user is viewing the posts so set their view date to now.
        u = User.get(User.id == user_id)
        uvt = None
        try:
            # logger.error('looking for view entry.')

            uvt = UserViewedThread.select().where( (UserViewedThread.user == u) & (UserViewedThread.thread == t) ).get()
            # logger.error('found view entry')
        except UserViewedThread.DoesNotExist:
            # logger.error('didnt find view entry')
            uvt = UserViewedThread(user = u, thread = t)
        
        uvt.last_viewed = utc_datetime_now()
        
        uvt.save()

        return_posts = []
        for p in Post.select().join(User).where(Post.thread == t).order_by(Post.created_on.asc()):
            return_posts.append({
                'id': p.id,
                'content': p.content,
                'created_on': p.created_on,
                'modified_on': p.modified_on,
                'username': p.user.name,
                'user_id': p.user.id
            })
        return_data = create_success_response(return_posts)
        return(jsonify(return_data), 200)

    if request.method == 'POST':
        request.get_json(force=True)
        data = request.json
        u = User.get(User.id == user_id)
        p = Post(user = u, thread = t)
        p.sanitized_update(content = data['content'])
        p.save()
        t.last_post_on = utc_datetime_now()
        t.save()
        return_data = create_success_response([])
        return(jsonify(return_data), 200)

@app.route('/api/post/<string:post_id>', methods=['GET', 'DELETE', 'PUT'])
@require_jwt_authenticate
def r_post(user_id, post_id):
    try:
        p = Post.get(Post.id == post_id)
    except Post.DoesNotExist:
        return_data = create_error_response('Could not find post with id of %s' % post_id, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':
        return_post = {
            'id': p.id,
            'content': p.content,
            'created_on': p.created_on,
            'modified_on': p.modified_on,
            'username': p.user.name,
            'user_id': p.user.id
        }
        return_data = create_success_response(return_post)
        return(jsonify(return_data), 200)

    if request.method == 'DELETE':
        p.delete_instance()
        return_data = create_success_response([])
        return(jsonify(return_data), 200)

    if request.method == 'PUT':
        if(p.user.id == user_id):
            request.get_json(force=True)
            data = request.json
            p.sanitized_update(data['content'])
            p.modified_on = utc_datetime_now()
            p.save()
            return_data = create_success_response([])
            return(jsonify(return_data), 200)
        else:
            return_data = create_error_response('User does not have permissions to edit the post to edit the post.', ERROR_CODES.UNAUTHORIZED)
            return(jsonify(return_data), 401)


@app.route('/api/user/', methods=['GET', 'POST'])
@require_jwt_authenticate
def r_user(user_id):

    if request.method == 'GET':

        return_users = []
        for u in User.select().order_by(User.name):
            return_users.append({
                'name': u.name,
                'id': u.id,
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

@app.route('/api/user/<int:managed_user_id>', methods=['GET', 'DELETE', 'PUT'])
@require_jwt_authenticate
def r_user_id(user_id, managed_user_id=None):

    try:
        u = User.get(User.id == managed_user_id)
    except User.DoesNotExist:
        return_data = create_error_response('Could not find user with id of %s' % managed_user_id, ERROR_CODES.NOT_FOUND)
        return(jsonify(return_data), 404)

    if request.method == 'GET':
        return_user = {
            'name': u.name,
            'id': u.id,
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

    if request.method == 'PUT':
        request.get_json(force=True)
        data = request.json

        # Currently only supports updating for the requesting user.
        try:
            logger.error('u.id is %s and managed_user_id is %s', (u.id, managed_user_id))
            if(u.id == managed_user_id):
                logger.error('id mached')
                user_changed = False

                # Process possible password changes.
                if 'password' in data:
                    logger.error('found password %s' % data['password'])
                    # Validate the password.
                    if len(data['password']) < 8:
                        return_data = create_error_response('The password must be at least 1 characters.', ERROR_CODES.MINIMUM_LENGTH_NOT_MET)
                    else:
                        u.password = hash_password(data['password'])
                        user_changed = True
                        return_data = create_success_response([])
                # Process user name change.
                elif 'name' in data:
                    logger.error('found name %s' % data['name'])
                    # Must be of atleast one character in length.
                    if len(data['name']) < 1:
                        return_data = create_error_response('The users name must be at least 1 characters.', ERROR_CODES.MINIMUM_LENGTH_NOT_MET)
                    else:
                        # Must be unique. 
                        try:
                            uFound = User.get(User.name == data['name'])
                            return_data = create_error_response('The users name is not unique.', ERROR_CODES.PARAMETER_NOT_UNIQUE)
                        except User.DoesNotExist:
                            u.name = data['name']
                            user_changed = True
                            return_data = create_success_response([])
                
                if user_changed:
                    u.save()
                return(jsonify(return_data), 200)

                # u.password = hash_password(data['password'])
                # u.save()
                # return_data = create_success_response([])
                # return(jsonify(return_data), 200)
        except KeyError:
            pass

        return_data = create_error_response('The user could not be changed.', ERROR_CODES.REQUEST_NOT_FULFILLED)
        return(jsonify(return_data), 200)


