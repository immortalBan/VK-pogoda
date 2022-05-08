const express = require("express");
const cheerio = require("cheerio");
const cyrillicToTranslit = require("cyrillic-to-translit-js");
const request = require("request");
const rp = require("request-promise");
const VKBot = require("node-vk-bot-api");
const body_parser = require("body-parser");
const Markup = require("node-vk-bot-api/lib/markup")

const port = 5000;
const app = express();
//const server = require('http').createServer(app);

const token =
  "9b97e20ae3cea009580691c0992dbca7c9754a66a8f11de2b4b918a9ebb5432dc8ab34e6280a97b1cf0cb";
const confirmation_code = "ec9e07d0";

app.use(body_parser.json());

const bot = new VKBot({
  token: token,
  confirmation: confirmation_code,
});
app.post("/", bot.webhookCallback);

bot.command("/start", (ctx) => {
  ctx.reply("Для получения погоды введите название города", null);
});

bot.on((ctx) => {
   let city = ctx.message.text;
   city = cyrillicToTranslit().transform(city, "_");
   const url = `https://pogoda.mail.ru/prognoz/${city}`;
   rp(url)
     .then(function (html) {
       const $ = cheerio.load(html);
       let data = "";
       $(
         "body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_temperature > div.information__content__temperature"
       ).each((idx, elem) => {
         const title = $(elem).text();
         data = title;
       });
       ctx.reply(data);
       $(
         "body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_first > div"
       ).each((idx, elem) => {
         const title = $(elem).text();
         data = title;
       });
       ctx.reply(data);
     })
     .catch(function (err) {
       console.error(err);
     });
});
app.listen(port, function () {
  console.log(`Listen on port ${port}`);
});
