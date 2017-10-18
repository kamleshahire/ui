const request = require('request');
const express = require('express');
const app = express();
const TelegramBot = require('node-telegram-bot-api');

var startCmd = require('./commands/start').start;
var helpCmd = require('./commands/help').help;
var priceCmd = require('./commands/price').price;
var volumeCmd = require('./commands/volume').volume;
var feedbackCmd = require('./commands/feedback').feedback;
var settingsCmd = require('./commands/settings').settings;

// const aws = require('aws-sdk');

// let s3 = new aws.S3({
//   accessKeyId: process.env.S3_KEY,
//   secretAccessKey: process.env.S3_SECRET
// });


// START TelegramBot
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const api_host_url = process.env.ITT_API_HOST;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const telegram_message_options = {
  parse_mode: "Markdown"
};


bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;

  var opts =
    {
      "parse_mode": "Markdown",
      "disable_web_page_preview": "true"
    };

  bot.sendMessage(chatId, startCmd.text, opts);
});

bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, helpCmd.text());
});

// match with /price, throw away all the blanks, match with any single char
bot.onText(/\/price(\s*)(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const coin = match[2]; // the captured "whatever"

  priceCmd.getPrice(coin)
    .then((result) => {
      bot.sendMessage(chatId, result.toString() + " BTC", telegram_message_options);
    })
    .catch((reason) => {
      console.log(reason);
      bot.sendMessage(chatId, reason, telegram_message_options);
    });
});

bot.onText(/\/volume(\s*)(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const coin = match[2]; // the captured "whatever"

  volumeCmd.getVolume(coin)
    .then((result) => {
      bot.sendMessage(chatId, result.toString() + " BTC", telegram_message_options);
    })
    .catch((reason) => {
      console.log(reason);
      bot.sendMessage(chatId, reason);
    });
});

bot.onText(/\/feedback(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const feedback = match[1];

  feedbackCmd.storeFeedback(feedback)
    .then((result) => {
      bot.sendMessage(chatId, result);
    })
    .catch((reason) => {
      console.log(reason);
      bot.sendMessage(chatId, reason);
    });
});

bot.onText(/\/settings/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, settingsCmd.text, settingsCmd.options);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  //bot.sendMessage(chatId, 'Received your message');
});

