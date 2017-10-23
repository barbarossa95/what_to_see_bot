// bot.js
//
// Created by Greshilov at 23.10.2017
//
// bot main file

function Bot () {

    const movieDbApiKeyV3 = process.env.MOVIE_DB_API_KEY || 'bdd5822cfe3827daf35a3f4cac9f061c';
    const telegramBotToken = process.env.TELEGRAM_BOT_API_KEY || '410067932:AAGw0knV8r4yNVZVLE93aSiX9Bg06EpCJ4U';

    const MovieDB = require('moviedb');
    const TelegramBotApi = require('node-telegram-bot-api');

    // Webhook port
    const port = process.env.PORT || 443;
    // Webhook url
    const url = process.env.APP_URL || `https://glacial-shelf-62769.herokuapp.com:443`;

    // MovieDB language
    const LANG =  process.env.LANG || 'en-US';

    // Items per search request
    const ITEMS_LIMIT = process.env.ITEMS_LIMIT || 20;

    // Bot Api options
    const options = {
        // pooling: true,
        webHook: {
            port: port
        }
    };

    bot = new TelegramBotApi(telegramBotToken, options);
    moviedb = MovieDB(movieDbApiKeyV3);

    // bot.getUpdates()
    //     .then((res) => {
    //         bot.sendMessage(res[0].message.chat.id, getRandomAnswer());
    //     }).catch((err) => console.log(err));

    bot.setWebHook(`${url}/bot${telegramBotToken}`);

    bot.onText(/\/echo (.+)/, (msg, match) => {
        const resp = match[1];
        bot.sendMessage(msg.chat.id, resp);
    });

    bot.onText(/\/searchByName (.+)/, (msg, match) => {
        const query = match[1];

        moviedb.search({
            query   : query,
            language: language}, (err, res) => {
                if (err) return;
                res.items.forEach((element) => {

                }, this);
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

    /**
     * All answer on all other messages
     */
    bot.on('message', function onMessage(msg) {
        Math.random
        bot.sendMessage(msg.chat.id, getRandomAnswer());
    });

    /**
     * Get random message text
     *
     * @returns message
     */
    function getRandomAnswer() {
        min = Math.ceil(0);
        max = Math.floor(2);
        rand = Math.floor(Math.random() * (max - min)) + min;
        if (rand === 1) return "так";
        return "ишо?";
    }

    return this;
}

module.exports = Bot;