const express = require("express");
const cheerio = require("cheerio");
const cyrillicToTranslit = require("cyrillic-to-translit-js");
const request = require("request");
const rp = require("request-promise");
const VKBot = require("node-vk-bot-api");
const body_parser = require("body-parser");

const port = 5000;
const app = express();
//const server = require('http').createServer(app);

const token =
  "f423eabbced444876a04c3314ca853ad98eba092362c8c78b496dcfb3a10c500ee11275dd1c528254f7d2";
const confirmation_code = "9e855f2f";

app.use(body_parser.json());

const bot = new VKBot({
  token: token,
  confirmation: confirmation_code,
});
app.post("/", bot.webhookCallback);

bot.command("/start", (ctx) => {
  ctx.reply("Для получения погоды введите название города");
});

bot.on((ctx) => {
  console.log(ctx.message.text);
  ctx.reply(ctx["message"]["text"]);
  // let city = ctx.message.text;
  // console.log(city);
  // ctx.reply(city);
  // city = cyrillicToTranslit().transform(city, "_");
  // const url = `https://pogoda.mail.ru/prognoz/${city}`;
  // ctx.reply(url);
  // rp(url)
  //   .then(function (html) {
  //     const $ = cheerio.load(html);
  //     let data = "";
  //     $(
  //       "body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_temperature > div.information__content__temperature"
  //     ).each((idx, elem) => {
  //       const title = $(elem).text();
  //       data = title;
  //     });
  //     ctx.reply(data);
  //   })
  //   .catch(function (err) {
  //     console.error(err);
  //   });
});
app.listen(port, function () {
  console.log(`Listen on port ${port}`);
});
