// Package Imports.
const Twit = require("twit");
const fetch = require("node-fetch");

// Local Imports.
const config = require("./config");

const sessions = require("./cowinapi");

// Making a Twit object for connecting to the API.
const T = new Twit(config);

// Setting up a user stream
const stream = T.stream("statuses/filter", {
  track: "@YourSlots",
});

// Listening to Stream.
stream.on("tweet", tweetEvent);

// Function when tweet event is trigerred.
function tweetEvent(tweet) {
  let sum1 = 0;
  let sum2 = 0;

  let sum3 = 0;
  let sum4 = 0;
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

  // Convert to DD-MM-YY Format.
  let date = convert(tweet.created_at);
  console.log(date);

  if (reply_to === "YourSlots" && isValid) {
    // Get data from SETU API & send that as tweet.
    const api_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pinCode}&date=${date}`;

    fetch(api_url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            data.sessions.forEach((element) => {
              if (element.min_age_limit == 18) {
                sum1 = sum1 + element.available_capacity_dose1;
                sum2 = sum2 + element.available_capacity_dose2;
              } else {
                sum3 = sum3 + element.available_capacity_dose1;
                sum4 = sum4 + element.available_capacity_dose2;
              }
            });
            if (
              data.sessions.length === 0 ||
              (sum1 === 0 && sum2 === 0 && sum3 === 0 && sum4 === 0)
            ) {
              let newTweet =
                "@" + from + " Sorry ! No slots available in your pincode.";

              // Post Tweet.
              postTweet(newTweet, tweet.id_str);
            } else {
              let newTweet =
                "@" +
                from +
                " There are " +
                sum1 +
                " dose-one slots available and " +
                sum2 +
                " dose-two slots available for 18 to 44 yrs.\n There are " +
                sum3 +
                " dose-one slots available and " +
                sum4 +
                " dose-two slots available for 45 yrs & above.";

              // Post Tweet.
              postTweet(newTweet, tweet.id_str);
            }
          });
        } else {
          throw "Something went wrong;";
        }
      })
      .catch((e) => console.log(e));
  } else if (reply_to === "YourSlots" && !isValid) {
    let newTweet = "@" + from + " Your pincode looks invalid!";

    // Post Tweet.
    postTweet(newTweet, tweet.id_str);
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

// Function for converting to DD-MM-YY Format.
function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("-");
}
