const fetch = require("node-fetch");

function getData() {
  const api_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=180013&date=28-05-2021`;
  let data;

  fetch(api_url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          data = data;
        });
      } else {
        throw "Something went wrong;";
      }
    })
    .catch((e) => console.log(e));

  return data;
}
