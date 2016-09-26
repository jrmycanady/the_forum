# Aburrr Forum Documentation


## Production Install

# Install node
curl -sL http://nsolid-deb.nodesource.com/nsolid_setup_1.x | sudo bash -
sudo apt-get -y install nsolid-developer-bundle

# Install python
apt-get install python3 python3-venv python3-pip build-essential python-dev libffi-dev



# Download source.
git clone https://github.com/jrmycanady/the_forum.git
cd the_forum


# Create virual env
pyvenv virtualenv
source ./virtualenv/bin/activate

# Install python packages
If windows make sure you have the visual studio 2015 build tools for C++ installed.
pip install wheel
pip install argon2_cffi flask peewee pytz uuid PyJWT

# Test the server
python3 run_server.py

# Install production server
pip install uwsgi

# Run prodution as http
cd tfserver
uwsgi --http 45.55.182.132:5000 --wsgi-file __init__.py --callable app --stats 45.55.182.132:6000

# Install client software
cd tfclient
npm install
Download and add the semantic.css to the semantic folder in the tfclient





## REST API

### Headers
The only header that needs to be modified for a request is the aburrr using is the aburrr_token header for the JWT token.

### Resources
#### /auth/
* POST
##### Request Body
```json
  {
    "username": "<string>",
    "password": "<string>"
  }
```
##### Return Object (On Success)
```json
 {
   "meta": {
     "error": false,
     "count": 1
   },
   "data": {
     "aburrr_token": "<string>"
   }
 }
 ```

##### /thread/
* GET
* POST
##### Request Body
```json
  {
    "title": "<string>"
  }
```

##### /thread/<thread_uuid>
* URL PARAMS
  * **thread_uuid:** The UUID of the specific thread to operate on.
* GET
* DELETE

##### /thread/<thread_uuid>/post/
* URL PARAMS
  * **thread_uuid:** The UUID of the specific thread to operate on.
* GET
* POST

##### /post/<post_uuid>
* URL PARAMS
  * **post__uuid:** The UUID of the specific post to operate on.
* GET
* DELETE
* PUT

##### /user/
* GET
* POST

##### /user/<user_uuid>
* URL PARAMS
  * **user_uuid:** The UUID of the specific user to operate on.
* GET
* DELETE
