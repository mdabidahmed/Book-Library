var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('./data/student.json')
var books = require('./data/book.json')
var hbs = require("hbs");
var app = express();
app.set("view engine", "hbs");
var port = 3000;



app.use(session({
    secret: "Express session secret!"
}));

app.use(bodyParser.urlencoded());

var filteredResults = books;

app.use(function(req,res, next){
    console.log(req.method+" "+req.protocol + "://"+ req.hostname + ":" + port + req.originalUrl);
    console.log("Session Id: "+ req.session.id);
    console.log(req.body);
    next();
});
app.post("/search", function(req, res){
    console.log("serch: ", req.body);
    var language = req.body.language.toLowerCase();
    filteredResults =   books.filter(function(obj){
                                
                                              return obj.language === language;
                                             });
                      res.redirect("/user");
                    });


// app.get('/test', function(req,res){
//     if(req.session.counter == undefined){
//         req.session.counter = 1;
//         res.send("Welcome to this page for the first time");
//     }
//     else{
//         req.session.counter++;
//         res.send("You visited this page "+ req.session.counter + "times");
//     }
//         res.send("Welcome");
// });

app.get('/login', function(req, res){
res.sendfile('public/index.html');
 })

app.post('/auth', function(req, res){
    console.log(db.length);
    for (var i = 0; i < db.length; i++) 
    {
       if(req.body.email === db[i].email && req.body.password === db[i].password)
       {
            req.session.login = true;
            req.session.studentName = db[i].name;
           
       }
        
    }
        res.redirect('/user');

   });

   app.get('/user', function(req, res){
             
     
       if(req.session.login == true){
        res.render("index", {
            books: filteredResults
        });
           
        // res.send("Welcome "+ req.session.studentName + "Do you want to <a href='/logout'>logout</a>");
       }
       else{
        res.redirect('/login');
       }
   });

   app.get('/logout', function(req, res){
       req.session.destroy();
       res.redirect('/login');
   
});

  

app.listen(3000, function(req,res){
    console.log("The server is started prot 3000");
});