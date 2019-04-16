require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var appCommand = process.argv[2];

var userSearch = process.argv.slice(3).join(" ");

function liriRun(appCommand, userSearch) {
  switch (appCommand) {
    case "spotify-this-song":
      getSpotify(userSearch);
      break;

    case "concert-this":
      getBandsInTown(userSearch);
      break;

    case "movie-this":
      getOMDB(userSearch);
      break;

    case "do-what-it-says":
      getRandom();
      break;

    default:
      console.log("Please enter one of the following commands:'concert-this', 'spotify-this-song','movie-this")
  }
}

//Function to search Spotify API
function getSpotify(songName) {

  var spotify = new Spotify(keys.spotify);

  if (!songName) {
    songName = "The Sign";
  }

  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occured: ' + err);
    }

    console.log("========================");

    console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");

    console.log("Song Name: " + data.tracks.items[0].name + "\r\n");

    console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");

    console.log("Album:" + data.tracks.items[0].album.name + "\r\n");


  });

}

//Function to search Bands In Town API
function getBandsInTown(userSearch) {
  var artist = userSearch;
  var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(bandQueryURL).then(
    function (response) {

      console.log("========================");

      console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
      console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
      console.log("Data of event: " + moment(response.data[0].datatime).format("MM-DD-YY") + "\r\n");


    });

};
//Function to serach OMDB API
function getOMDB(movie) {

  if (!movie) {
    movie = "Mr. Nobody";
  }
  var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.request(movieQueryUrl).then(
    function (response) {
      console.log("================");
      console.log("* Title: " + response.data.Title + "\r\n");
      console.log("* Year Released: " + response.data.Year + "\r\n");
      console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
      console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
      console.log("* Country Where Produced: " + response.data.Country + "\r\n");
      console.log("* Language: " + response.data.Language + "\r\n");
      console.log("* Plot: " + response.data.Plot + "\r\n");
      console.log("* Actors: " + response.data.Actors + "\r\n");

      //logResults(response);
      var logMovie = "=====Begin Movie Log Entry======" + "\nMovie title:" + response.data.Title + "\nYear realse"

      fs.appendFile("log.txt", logMovie, function (err) {
        if (err) throw err;
      });
    });
};

//FUNCTION RANDOM
function getRandom() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.lor(error);

    } else {
      console.log(data);

      var randomData = data.split(",");
      liriRun(randomData[0], randomData[1]);
    }

  });
};
//FUNCTION to log results from the other functions
function logResults(data) {
  fs.appendFile("log.txt", data, function (err) {
    if (err) throw err;
  });
};

liriRun(appCommand, userSearch);
