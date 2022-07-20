const express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     mongoose = require("mongoose"),
     Campground = require("./models/campgrounds"),
     seedDB= require("./seeds"),
     passport = require("passport"),
     LocalStrategy = require("passport-local"),
      User = require("./models/user"),
    Comment= require("./models/comment");


seedDB();
mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"))

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "my name is riti" ,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/' , function(req , res){
    res.render("landing");
})
app.get('/campgrounds' , function(req , res){
    Campground.find({} , function(err , allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index" , {campgrounds:allCampgrounds});
        }
    });

});

app.post('/campgrounds' , function(req , res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampgrounds = {name : name , image : image , description:description };
    //create new campground to save in db
    Campground.create(newCampgrounds , function(err , newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
})
//NEW
app.get('/campgrounds/new' , function(req , res){
    res.render("campgrounds/new");
});


//SHOW ROUTE- show data for campground
app.get("/campgrounds/:id", function(req, res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
    
})

/*******************Comments routes***********************/

app.get("/campgrounds/:id/comments/new", isLoggedIn , function(req, res){
    //find the campground
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })
    
})

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("campgrounds");
        }else{
             //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                     //connect comment to id
                     campground.comments.push(comment);
                     campground.save();
                     res.redirect("/campgrounds/"+req.params.id);
                }
            })
        }
    })
})


// AUTH ROUTES

//Show register form
app.get("/register" , function(req , res){
    res.render("register");
});

//sign up logic

app.post("/register" , function(req , res){
    let newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password , function(err , user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req , res , function(){
            res.redirect("/campgrounds");
        });
    });
});

//Login
//show login form
app.get("/login" , function(req , res){
    res.render("login");
})

//jlogin logic

app.post("/login" , passport.authenticate("local" , 
{
    successRedirect: "/campgrounds" ,
    failureRedirect: "/login"
}) ,function(req , res){

})

//logout
app.get("/logout" , function(req , res){
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(res , req , next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}




app.listen(3000 , function(){
    console.log("App has Started!!!");
})