const fetch = require("node-fetch");

const pin_code = "282001";
const date = "26-05-2021";

const api_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin_code}&date=${date}`;

fetch(api_url, {
  headers: { "User-Agent": "Mozilla/5.0" },
})
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
