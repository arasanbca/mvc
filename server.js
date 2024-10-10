ex = require("express");
mongoose = require("mongoose");
pass = require("passport");
bp= require("body-parser");
Local = require("passport-local");
LM = require("passport-local-mongoose");
User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/mvc");

app = ex();

app.set("view engine","ejs");

app.use(bp.urlencoded({extend:true}));
app.use(require("express-session")
({
    secret:'Aravindh',
    resave:false,
    saveUninitialized:false
}));

app.use(pass.initialize());
app.use(pass.session());

pass.use(new Local(User.authenticate()));
pass.serializeUser(User.serializeUser());
pass.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home");
})

app.get("/profile",isLoggedIn,function(req,res){
    res.render("profile")
})
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var username = req.body.username
    var password = req.body.password
    var email = req.body.Email

    User.register(new User({username:username}),
    password,function(err,user){
        if (err){
            console.log(err);
            return res.render("register") 
        }
        pass.authenticate("local")
    (req,res,function(){
        res.render("login");
    });
});
});

app.get("/login",function(req,res){
    res.render("login")
});

app.post("/login",pass.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login"
}),function(req,res){});

app.get("/logout",function(req,res,next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect("/");
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next()
    res.redirect("/login");
}

app.listen(6500);
console.log("http://localhost:6500");
