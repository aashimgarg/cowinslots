const fetch = require("node-fetch");

function fetchData(pin_code, date) {
  const api_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin_code}&date=${date}`;

  fetch(api_url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

export default fetchData;
