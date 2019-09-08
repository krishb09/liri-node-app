require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require("axios"); 
var keys = require("./keys.js");
var moment = require('moment');
var fs = require('fs'); 
moment().format(); 

var spotify= new Spotify(keys.spotify);
 
// Make it so liri.js can take in one of the following commands:

// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

var commandLine = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

//use switch statements to see which command user enters
switch(commandLine){

case "concert-this": 
    concert_this(userInput);
    break; 

case "spotify-this-song":
    spotify_this(userInput); 
    break; 

case "movie-this":
    movie_this(userInput); 
    break; 

case "do-what-it-says":
    do_what_it_says(); 
    break; 

}

function concert_this(userInput){ //use axios package
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

function spotify_this(userInput){

// console.log(userInput); 
if(!userInput ){
    userInput = "The Sign Ace of Base"

}
  spotify
  .search({ type: 'track', query: userInput, limit: 1})
  .then(function(response) {
    
        var data = response.tracks.items; 
        for(var i=0; i< data.length; i++){
        // console.log(response.tracks.items);
        console.log("=============Artist==Song==Album==URL=============================");
        console.log("Artist: " + data[i].album.artists[0].name); 
        console.log("Song name: " + data[i].name);//name of song
        console.log("Album name: " + data[i].album.name); //name of album
        console.log("Spotify link: " + data[i].album.uri); //link of the song
        //uri is spotify link
        }
  })
  .catch(function(err) {
    console.log(err);
  });
}

function movie_this(userInput){ //OMDB api 

    if(!userInput){
        userInput = "Mr. Nobody";  
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl)
    .then(function(response) {
    // If the axios was successful...
    // Then log the body from the site!
    // console.log("REPONSE", response.data); 
    console.log("------------------------------");
    console.log("Movie Title: " + response.data.Title); 
    console.log("Year Released: " + response.data.Year); 
    console.log("IMDB Rating: " + response.data.imdbRating); 
    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value); 
    console.log("Country it was produced in: " + response.data.Country); 
    console.log("Language(s): " + response.data.Language); 
    console.log("Plot: " + response.data.Plot); 
    console.log("Actors in the movie: " + response.data.Actors); 

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
function do_what_it_says(){
    fs.readFile("random.txt", "utf8", function(error, data) { //callback function 
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        // We will then print the contents of data
        var content = data.split(","); 
        var command = content[0]; 
        var item = content[1]; 

        if(command === "spotify-this-song"){
            spotify_this(item); 
        }else if(command === "concert-this"){
            concert_this(item);
        }else if(command === "movie-this"){
            movie_this(item); 
        }

        fs.appendFile("log.txt", command + "\n", function(err) { //add every command  
          // If the code experiences any errors it will log the error to the console.
          if (err) {
            return console.log(err);
          }
          // Otherwise, it will print: "movies.txt was updated!"
          console.log("log.txt was updated!");
        });
      });
    //   spotify-this-song,"I Want it That Way", movie-this, "Mean Girls", concert-this, "Broods"
}
