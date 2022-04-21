const express = require("express");
const cheerio = require("cheerio");
const cyrillicToTranslit = require("cyrillic-to-translit-js");
const request = require("request");
const rp = require("request-promise");

const port = 5050;
const app = express();
const server = require("http").createServer(app);

app.get("/get/:city", (req, res) => {
  let city = req.params.city;
  city = cyrillicToTranslit().transform(city, "_");
  const url = `https://pogoda.mail.ru/prognoz/${city}`;
  rp(url)
    .then(function (html) {
      const $ = cheerio.load(html);
      let data = [];
      $(
        "body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_first > div:nth-child(1)"
      ).each((idx, elem) => {
        const title = $(elem).text();
        data.push(title);
      });
      res.send(data);
    })
    .catch(function (err) {
      console.error(err);
    });
});

server.listen(port, function () {
  console.log("listening on port " + port);
});
