/**
 * bot.js
 *
 * Created by Greshilov at 23.10.2017
 *
 * Bot main file
 */

function Bot () {

    const movieDbApiKeyV3 = process.env.MOVIE_DB_API_KEY || 'bdd5822cfe3827daf35a3f4cac9f061c';
    const telegramBotToken = process.env.TELEGRAM_BOT_API_TOKEN || '410067932:AAGw0knV8r4yNVZVLE93aSiX9Bg06EpCJ4U';

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
        webHook: {
            port: port
        }
    };

    bot = new TelegramBotApi(telegramBotToken, options);
    moviedb = MovieDB(movieDbApiKeyV3);

    bot.setWebHook(`${url}/bot${telegramBotToken}`);


    cmdMenu({ chat: { id: 267461350}});

    bot.onText(/\/start (.+)/, cmdMenu);

    bot.onText(/\/menu (.+)/, cmdMenu);

    bot.onText(/\/echo (.+)/, cmdEcho);

    bot.onText(/\/searchByName (.+)/, cmdSearchByName);

    /**
     * Answer on all messages

    bot.on('message', function onMessage(msg) {
        Math.random
        bot.sendMessage(msg.chat.id, getRandomAnswer());
    });
     */

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

    function cmdMenu(msg, match) {
        const opts = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Button1',
                     // we shall check for this value when we listen
                     // for "callback_query"
                    callback_data: 'Button1'
                  }
                ]
              ]
            }
        };
        bot.sendMessage(msg.chat.id, 'Bot Menu:', opts);
    }

    /**
     * Echo command
     * @param  {object} msg entire message
     * @param  {array} match regexp array
     * @return {void}
     */
    function cmdEcho(msg, match) {
        const resp = match[1];
        bot.sendMessage(msg.chat.id, resp);
    }

    /**
     * Search films by name
     * @param  {object} msg entire message
     * @param  {array} match regexp array
     * @return {void}
     */
    function cmdSearchByName(msg, match) {
        const query = match[1];

        moviedb.searchMovie({
            query   : query,
            language: LANG}, (err, res) => {
                if (err) return;
                sendMovies(res.results, msg.chat.id);
            });
    }
    /**
     * Send movies array in chat with user
     * @param  {array} movies
     * @param  {integer} target chat id
     * @return {void}
     */
    function sendMovies(movies, chatId) {
        for (var movie of movies) {
            message = `<b>${movie.title}</b>\n`;
            message += movie.overview;
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        }
    }

    return this;
}

module.exports = Bot;