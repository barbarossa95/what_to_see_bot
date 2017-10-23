// bot.js
//
// Created by Greshilov at 23.10.2017
//
// bot main file

module.exports = (argument) => {

    const movieDbApiKeyV3 = process.env.MOVIE_DB_API_KEY || 'bdd5822cfe3827daf35a3f4cac9f061c';
    const telegramBotToken = process.env.TELEGRAM_BOT_API_KEY || '410067932:AAGw0knV8r4yNVZVLE93aSiX9Bg06EpCJ4U';

    const MovieDB = require('moviedb');
    const TelegramBotApi = require('node-telegram-bot-api');

    // Webhook port
    const port = process.env.PORT || '443';
    // Webhook url
    const url = process.env.APP_URL || `https://<app-name>.herokuapp.com:${port}`;

    // MovieDB language
    const LANG =  process.env.LANG || 'en-US';

    // Items per search request
    const ITEMS_LIMIT = process.env.ITEMS_LIMIT

    // Bot Api options
    const options {
        webHook: {
            port: port
        }
    };

    const bot = TelegramBotApi(telegramBotToken, options);
    const moviedb = MovieDB(movieDbApiKeyV3);

    bot.setWebHook(`${url}/bot${telegramBotToken}`);

    bot.onText(/\/echo (.+)/, function onEchoText(msg, match) {
        const resp = match[1];
        bot.sendMessage(msg.chat.id, resp);
    });

    bot.onText(/\/searchByName (.+)/, function onEchoText(msg, match) {
        const query = match[1];

        moviedb.search({
            query   : query,
            language: language}, (err, res) => {
                if (err) return;


                bot.sendMessage(msg.chat.id, resp);
            });

        bot.sendMessage(msg.chat.id, resp);
    });

    /*
    bot.onText(/\/searchByKeywords (.+)/, function onEchoText(msg, match) {
        const query = match[1];
        //todo discover api command
    });
    */
}