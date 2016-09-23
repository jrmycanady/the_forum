# Aburrr Forum Documentation

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
