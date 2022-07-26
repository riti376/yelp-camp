var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");



var data= [
    {
        name: "Anjuna beach – Goa",
        image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__480.jpg",
        description: "Camping on a beach is truly something every traveler must experience. Anjuna Beach is one of the best camping sites in India. The popular beach in Goa has some of the best scenes and lifestyle of Goa’s hippy culture. Camping here means hearing the constant melody of waves, amazing access to sunrise and sunset. Beaches, chapels and flea markets are close by, so is the happening nightlife."
    },
    {
            name: "Tso Moriri Lake, Ladakh",
            image: "https://cdn.pixabay.com/photo/2017/06/17/03/17/gongga-snow-mountain-2411069__480.jpg",
            description: "Tsomoriri Lake is the highest lake in the world and located in Ladakh. Camping here is the experience of a lifetime"
    },
    {
        name: "Anjuna beach – Goa",
        image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__480.jpg",
        description: "Camping on a beach is truly something every traveler must experience. Anjuna Beach is one of the best camping sites in India. The popular beach in Goa has some of the best scenes and lifestyle of Goa’s hippy culture. Camping here means hearing the constant melody of waves, amazing access to sunrise and sunset. Beaches, chapels and flea markets are close by, so is the happening nightlife."
    }
]

function seedDB(){
    //Remove all
    Campground.remove({} , function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campground");
        //add few
    data.forEach(function(seed){
        Campground.create(seed , function(err , campground){
            if(err){
                console.log(err)
            }else{
                console.log("Added a Campground");
            //create comment
            Comment.create(
                {
                    text: "This has very good food",
                    author: "riti"
                } , function(err ,  comment){
                    if(err){
                       console.log(err);
                    }else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log("created new cmmt");
                    }
                });
        }
        });

    });
 });
    
}

module.exports = seedDB;