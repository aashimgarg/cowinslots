// Package Imports.
const Twit = require("twit");

// Local Imports.
const config = require("./config");

// Making a Twit object for connecting to the API.
const T = new Twit(config);

// Setting up a user stream
const stream = T.stream("statuses/filter", { track: "@rainaarteev" });

// Listening to Stream.
stream.on("tweet", tweetEvent);

// Function when tweet event is trigerred.
const tweetEvent = (tweet) => {
  console.log("Tweeted");
  // Who is this in reply to?
  let reply_to = tweet.in_reply_to_screen_name;

  console.log(reply_to);
  // Who sent the tweet?
  let from = tweet.user.screen_name;

  // Text of the tweet.
  let text = tweet.text;

  // Id for replying in thread.
  let id = tweet.id_str;

  if (reply_to === "RainaArteev") {
    var newTweet = "@" + from + " thankyou for tweeting me!";
    postTweet(newTweet, id);
  }
}

// Function for Posting a tweet.
const postTweet = (txt, id) =>  {
  var tweet = {
    status: txt,
    in_reply_to_status_id: id,
  };

  // Post that tweet.
  T.post("statuses/update", tweet, tweeted);

  // Function to make sure tweet was sent.
  const tweeted = (err, reply) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Tweeted " + reply.text);
    }
  }
}
