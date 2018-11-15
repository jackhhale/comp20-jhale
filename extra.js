*/

// use express
var express = require('express')
var app = new express();
app.use(bodyParser.json);


app.post("/sumbit", function(request, response){
    var username = request.body.username;
    var score = request.body.score;
    var grid = request.body.grid;
    response.send({"result":"you typed in" + username});
});

app.get("/scores.json", function(request, response){
    var username = request.query.username;
    response.send([]);
});

app.get("/", function(request, response){
    response.send([]);
});

// lets the port to be set by heroku
app.listen(process.env.PORT || 8000);