# Getting Started with Node and MongoDB

## Config Node JS
  This project was Node.js® is an open-source, cross-platform JavaScript runtime environment. [Download Node App](https://nodejs.org/en).

## Config MongoDB, 
  In this project, I used connect Mongodb Atlas, so I attached the mongoDb Atlas URI for reference [MongoDb Atlas](https://cloud.mongodb.com).

``` shell
  mongodb+srv://vishwa_db:JXMeFiR2nSkff89Z@mycluster.5zwze.mongodb.net/post
```
In this mongodb atlas . I create a static roles collection in post database. that collection contains two roles.(i.e.)
``` text
    Admin
    User
```

## Installation
  Use the package manager to install packages.

```node
    npm install
```

## Start Server
```node 
    npm run dev
```

# ---------- USER API ------------

## 1. User registration [http://localhost:5000/api/user/register](http://localhost:5000/api/user/register)

### Method & Headers

```json
  {
    "method" : "POST",
    "headers": {
      "Content-Type": "application/json"
    }
  }
```
### Inputs

```json
  {
    "name":"XXXX",
    "email":"ex@gmail.com",
    "mobile":"1234567890",
    "password":"Welcome@123",
    "role":"65a0fea3e284344ecdf5b4e4"
  }
```

### Inputs Information

``` text
  name       => input string *
  email       => input string*  (email is unique for all user)
  mobile      =>  input string or number* (mobile is unique for all user)
  password    => input string *
  role        =>  Mongodb ObjectId get form below api*
```
### Get Role api [http://localhost:5000/api/user/get_role](http://localhost:5000/api/user/get_role)
```json
  {
    "method" : "POST"
  }
```

## 2. User Login [http://localhost:5000/api/user/login](http://localhost:5000/api/user/login)

### Method & Headers
```json
  {
    "method" : "POST",
    "headers": {
      "Content-Type": "application/json"
    }
  }
```
### Inputs

```json
{
  "mob-email":1234567890,
  "password":"Welcome@123"
}
```
### Inputs Information

``` text
    mob-email    =>  input string *  you can enter mobile number or email for login
    password     =>   input string * 
```


# ---------- POSTS API ------------
## 1. Create Post [http://localhost:5000/api/post/create_post](http://localhost:5000/api/post/create_post)

### Method & Headers
```json
  {
    "method" : "POST",
  	 "headers" : {
         "Authorization": `Bearer ${bearerToken}`, //  From user login api
        "Content-Type": "multipart/form-data"
}
  }
```
### Form-data Inputs

```text
    Key                  Value
	title                XXXX           -> input string * 
	description          YYYY           -> input string *
	isPrivate            true or false  ->  input boolean  pass only true or false (non mandatory)
	uploadFile           files          ->  upload files *
```

## 2. Read Post [http://localhost:5000/api/post/read_post](http://localhost:5000/api/post/read_post)

### Method & Headers
```json
  {
    "method" : "POST",
    "headers": {
	  "Authorization": `Bearer ${bearerToken}`, //  From user login api
      "Content-Type": "application/json"
    }
  }
```

### Inputs

```json
{
  "skip":0,
  "limit":0,
  "sortBy":"postId",
  "sortOrder":-1,
  "filterByUser":[],
  "searchValue":""
}
```
### Inputs Information

``` text
  skip               => input number (non-mand) default 0
  limit               => input number  (non-mand) default 0
  sortBy              =>  input string (non-mand) if you want sort pass field name from read_post api response
  sortOrder           => input number  pass (1 or -1)  (mand) if sortBy provide
  searchValue         => input string (non-mand)  if pass value it search based on post title and description
  filterByUser        =>  Mongodb ObjectId get form below api   (non-mand) pass in array format
```
### Get filterByUser api [http://localhost:5000/api/post/get_user](http://localhost:5000/api/post/get_user)

### Method & Headers
```json
  {
    "method" : "POST",
    "headers": {
	  "Authorization": `Bearer ${bearerToken}`, //  From user login api
      "Content-Type": "application/json"
    }
  }
```

## 3. Edit Post [http://localhost:5000/api/post/edit_post](http://localhost:5000/api/post/edit_post)

### Method & Headers
```json
  {
    "method" : "POST",
  	 "headers" : {
         "Authorization": `Bearer ${bearerToken}`, //  From user login api
        "Content-Type": "multipart/form-data"
}
  }
```
### Form-data Inputs

```text
    Key                  Value
	title                XXXX                    -> input string *  
	description          YYYY                    -> input string *
	isPrivate            true or false           ->  input boolean  pass only true or false (non mandatory)
	uploadFile           files                   ->  upload files *
	postId              65a8d7d74d020fb518eb090a ->  Mongodb ObjectId*   get from read_post API
```

## 4. Delete Post [http://localhost:5000/api/post/delete_post](http://localhost:5000/api/post/delete_post)

### Method & Headers
```json
  {
    "method" : "POST",
    "headers": {
	  "Authorization": `Bearer ${bearerToken}`, //  From user login api
      "Content-Type": "application/json"
    }
  }
```
### Inputs

```json
{
  "postId":"65a8d7d74d020fb518eb090a"
}
```
### Inputs Information

``` text
  postId   =>  Object Id *  - get from read_post API
```