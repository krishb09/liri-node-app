require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require("axios"); 
var keys = require("./keys.js");
var moment = require('moment');
moment().format(); 

var spotify= new Spotify(keys.spotify);
 

// Make it so liri.js can take in one of the following commands:

// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

var commandLine = process.argv[2];
var userInput = process.argv[3];

//use switch statements to see which command user enters
switch(commandLine){

case "concert-this": 
    concert_this();
    break; 

case "spotify-this-song":
    spotify_this_(); 
    break; 

case "movie-this":
    movie_this(); 
    break; 

case "do-what-it-says":
    do_what_it_says(); 
    break; 

}

function concert_this(){ //use axios package
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function(response) {
        // If the axios was successful...
        // Then log the body from the site!
        // let artist = response.data.lineup; 
       
        for(var i=0; i< response.data.length; i++){
            var name = response.data[i].venue.name; 
            var city = response.data[i].venue.city
            var date = response.data[i].datetime; 
            //use moment package to transform date
            var dateFormat = moment(date).format("MM-DD-YYYY"); 

            console.log("Name of venue: " + name);
            console.log("Venue location: " + city);
            console.log("Concert date: " + dateFormat);
            console.log("------------------------------");
        }
    })
    .catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
    });
}

function spotify_this_(){


// var spotify = new Spotify({
//   id: <your spotify client id>,
//   secret: <your spotify client secret>
// });
 
spotify
  .search({ type: 'track', query: 'userInput' })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });

}

function movie_this(){//bands_int_town api 

    // var queryUrl = ""

}

function do_what_it_says(){

}
