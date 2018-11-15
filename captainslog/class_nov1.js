/* 
How to build the server side?

3 routes POST /sumbit, GET /scores.json, GET /index.html

install express

npm: javascript package manager

npm install express 

*/

// use express
var express = require('express')
var app = new express()

app.post("/sumbit", function(request, response){
    response.send([]);
});

app.get("/scores.json", function(request, response){
    response.send([]);
});

app.get("/", function(request, response){
    response.send("Go away!");
});