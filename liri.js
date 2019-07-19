//Initialize all the npm packages and set up necessary variables
require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require("fs");
var command;
var secondCommand;

//Execute the commands
if (process.argv[2] == "my-tweets") {
  myTweets();
} else if (process.argv[2] == "spotify-this-song") {
  spotifyThisSong();
} else if (process.argv[2] == "movie-this") {
  movieThis();
} else if (process.argv[2] == "do-what-it-says") {
  doWhatItSays();
} else {
  console.log("Sorry, there is an error!");
}

//Functions of the four commands
function myTweets() {
  var screenName = { screen_name: "heguanelvis" };
  client.get("statuses/user_timeline", screenName, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      fs.appendFileSync("log.txt", "\r\nCommand: my-tweets\r\n");
      //Append 20 lastest tweets
      for (var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log(" ");
        console.log("Tweet #" + (i + 1));
        console.log(
          "@heguanelvis: " +
            tweets[i].text +
            " Created At: " +
            date.substring(0, 19)
        );
        console.log(
          "-------------------------------------------------------------------------------------------"
        );

        fs.appendFileSync(
          "log.txt",
          "\r\n" +
            "Tweet #" +
            (i + 1) +
            "\r\n" +
            "@heguanelvis: " +
            tweets[i].text +
            " Created At: " +
            date.substring(0, 19) +
            "\r\n" +
            "-----------------------------------------------------------------------------"
        );
      }
    }
  });
}

function spotifyThisSong() {
  //Default song if there is no input
  var song = "The Sign by Ace of Base";

  if (process.argv[2] == "spotify-this-song" && process.argv[3]) {
    song = process.argv.slice(3).join(" ");
  }
  //Otherwise, get commands from the random.txt
  else if (
    process.argv[2] == "do-what-it-says" &&
    !process.argv[3] &&
    secondCommand != undefined
  ) {
    song = secondCommand;
  }

  //Find three relevant search results
  spotify.search({ type: "track", query: song, limit: 3 }, function(
    error,
    data
  ) {
    if (!error) {
      fs.appendFileSync(
        "log.txt",
        "\r\nCommand: spotify-this-song " + song + "\r\n"
      );
      for (var i = 0; i < data.tracks.items.length; i++) {
        var songData = data.tracks.items[i];
        var artistArr = [];

        console.log(" ");
        console.log("Search Result #" + (i + 1));

        for (var j = 0; j < songData.artists.length; j++) {
          artistArr.push(songData.artists[j].name);
        }
        console.log("Artist(s): " + artistArr.join(", ").toString());
        //song name
        console.log("Song Name: " + songData.name);
        //spotify preview link
        console.log("Preview Link from Spotify: " + songData.preview_url);
        //album name
        console.log("From Album: " + songData.album.name);
        console.log(
          "-------------------------------------------------------------------------------------------"
        );

        fs.appendFileSync(
          "log.txt",
          "\r\n" +
            "Search Result #" +
            (i + 1) +
            "\r\n" +
            "Artist(s): " +
            artistArr.join(", ").toString() +
            "\r\n" +
            "Song Name: " +
            songData.name +
            "\r\n" +
            "Preview Link from Spotify: " +
            songData.preview_url +
            "\r\n" +
            "From Album: " +
            songData.album.name +
            "\r\n" +
            "-----------------------------------------------------------------------------"
        );
      }
    }
  });
}

function movieThis() {
  //Default movie if there is no input
  var movieName = "Mr. Nobody";

  if (process.argv[2] == "movie-this" && process.argv[3]) {
    movieName = process.argv.slice(3).join("+");
  } else if (
    process.argv[2] == "do-what-it-says" &&
    !process.argv[3] &&
    secondCommand != undefined
  ) {
    movieName = secondCommand;
  }

  var queryURL =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  request(queryURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(
        "-----------------------------------------------------------------------------------------------"
      );
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Movie Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log(
        "-----------------------------------------------------------------------------------------------"
      );

      fs.appendFileSync(
        "log.txt",
        "\r\nCommand: movie-this " +
          JSON.parse(body).Title +
          "\r\n" +
          "\r\n" +
          "Movie Title: " +
          JSON.parse(body).Title +
          "\r\n" +
          "Release Year: " +
          JSON.parse(body).Year +
          "\r\n" +
          "IMDB Rating: " +
          JSON.parse(body).imdbRating +
          "\r\n" +
          "Country: " +
          JSON.parse(body).Country +
          "\r\n" +
          "Language: " +
          JSON.parse(body).Language +
          "\r\n" +
          "Movie Plot: " +
          JSON.parse(body).Plot +
          "\r\n" +
          "Actors: " +
          JSON.parse(body).Actors +
          "\r\n" +
          "-----------------------------------------------------------------------------"
      );
    }
  });
}

function doWhatItSays() {
  //Read random.txt and process the data
  fs.readFile("random.txt", "utf8", function(error, data) {
    var dataArr = data.split(",");
    command = dataArr[0];
    fs.appendFileSync("log.txt", "\r\nCommand: do-what-it-says\r\n");
    if (dataArr.length > 1) {
      secondCommand = dataArr.slice(1).toString();
    }
    if (command == "my-tweets") {
      myTweets();
    } else if (command == "spotify-this-song") {
      spotifyThisSong();
    } else if (command == "movie-this") {
      movieThis();
    } else {
      console.log("Sorry, there is an error!");
    }
  });
}
