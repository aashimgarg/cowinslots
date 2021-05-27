// Package Imports.
const Twit = require("twit");

// Local Imports.
const config = require("./config");

// Making a Twit object for connecting to the API.
const T = new Twit(config);

// Setting up a user stream
const stream = T.stream("statuses/filter", { track: "@YourSlots" });

// Listening to Stream.
stream.on("tweet", tweetEvent);

// Function when tweet event is trigerred.
function tweetEvent(tweet) {
  console.log("Tweeted");
  // Who is this in reply to?
  let reply_to = tweet.in_reply_to_screen_name;

  console.log(reply_to);
  // Who sent the tweet?
  let from = tweet.user.screen_name;

  // Text of the tweet.
  let text = tweet.text;

  // Extract pin code from the text.
  let pinCode = text.replace(/\D/g, "");

  console.log(pinCode);

  // Check if pin code is valid or not.
  let isValid = validatePinCode(pinCode);

  console.log(isValid);

  // Id for replying in thread.
  let id = tweet.id_str;

  if (reply_to === "YourSlots" && isValid) {
    // Get data from SETU API & send that as tweet.
    var newTweet = "@" + from + " thankyou for tweeting me!";

    // Post Tweet.
    postTweet(newTweet, id);
  } else if (reply_to === "YourSlots" && !isValid) {
    var newTweet = "@" + from + " Your pincode looks invalid!";

    // Post Tweet.
    postTweet(newTweet, id);
  }
}

// Function for Posting a tweet.
function postTweet(txt, id) {
  var tweet = {
    status: txt,
    in_reply_to_status_id: id,
  };

  // Post that tweet.
  T.post("statuses/update", tweet, tweeted);

  // Function to make sure tweet was sent.
  function tweeted(err, reply) {
    if (err) {
      console.log(err);
    } else {
      console.log("Tweeted " + reply.text);
    }
  }
}

// Function for validating pin code.
function validatePinCode(pinCode) {
  let regex = new RegExp("^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$");

  let isValid = regex.test(pinCode);
  return isValid;
}
