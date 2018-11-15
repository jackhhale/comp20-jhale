/* 
How to build the server side?

3 routes POST /sumbit, GET /scores.json, GET /index.html

install express

npm: javascript package manager

npm install express 

curl --data makes POST request

heroku create

add procfile

two servers on same computer cannot use same port number

curl --data "username=dwe&score=wdwed&&grid=4"

include body parser

*/

var express = require('express');
var app = express();

app.get('/', function(request, response) {
    response.send("Hello world");
});

app.get('/pikachu', function(request, response) {
    response.send("You've won the game!");
});

app.listen(process.env.PORT || 8888);