I have create with Express js with mongodb(mongoose);

npm i
intall node packeges

API 1:- GET ALL USER (needed jwttoken in header header)
url:- /users/ , method:- GET

API 2:- GET ONE USER BY ID (needed jwttoken in header header)
url:- /users/:id , method:- GET

API 3:- CREATE A USER (this api also use for signup user)
url:- /users/create, method:- POST
fields:- email,first_name,last_name,password;
validation:- email-must be valid email address and unique email address;
             password- must be 6 digit

API 4:- LOGIN A USER
url:- /users/login, method:- POST
fields:- email,password,

API 5:- UPDATE USER (needed jwttoken in header header)
url:- /users/:id, method:- PUT

API 6:- DELETE A USER (needed jwttoken in header header)
url:- /users/:id ,method:- DELETE

API 7:- FORGOT PASSWORD
url:- /users/forgot/:email,method:- GET

we have genrate the random token and send to user by email

API 8:- RESET PASSWORD
url:- /users/reset, method:- POST
find user by email and reset the password
field:- email.pasword
