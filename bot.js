/**
 * bot.js
 *
 * Created by Greshilov at 23.10.2017
 *
 * Bot main file
 */

function Bot () {

    this.zoomers = {};

    this.getSoon = function(){
        console.log('getSoon');
    };
    this.getGenres = function(){
        console.log('getGenres');
    };
    this.getPopular = function(){
        console.log('getPopular');
    };

    console.log(this);


    if (typeof this['getSoon'] === 'function') {
        this['getSoon'].call(this);
    }
    return;


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

    bot.onText(/\/start/, cmdMenu);

    bot.onText(/\/menu/, cmdMenu);

    bot.onText(/\/zoomer (.+)/, cmdZoomer);

    bot.onText(/\/searchByName (.+)/, cmdSearchByName);

    bot.on('callback_query', onCallbackQuery);

    function onCallbackQuery(callbackQuery) {
        const action = callbackQuery.data;
        const msg = callbackQuery.message;
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
        };

        if (typeof [action] === undefined) return;

        this[action].call(this);
    }

    function cmdMenu(msg, match) {
        const opts = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Soon in cinema',
                    callback_data: 'getSoon'
                  }
                ],
                [
                  {
                    text: 'Films by genres',
                    callback_data: 'getGenres'
                  }
                ],
                [
                  {
                    text: 'Popular films',
                    callback_data: 'getPopular'
                  }
                ]
              ]
            }
        };
        bot.sendMessage(msg.chat.id, 'For searching movie use command: /search [film name]:', opts);
    }

    this.getSoon = function(){
        console.log('getSoon');
    };
    this.getGenres = function(){
        console.log('getGenres');
    };
    this.getPopular = function(){
        console.log('getPopular');
    };

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

    function cmdZoomer(msg, match) {
        const interval = match[1];

        if (!this.zoomers[msg.chat.id]) this.zoomers[msg.chat.id] = {};

        // Has no param - show info about current zoomer
        if (interval === 'undefined') {
            if (!this.zoomers[msg.chat.id].id) message = 'Currently no running zoomers';
            else message = 'Currently running zoomer 1';
            bot.sendMessage(msg.chat.id, message);
            return;
        }

        // Interval equals zero - delete zoomer
        if (interval === 0) {
            clearTimeout(this.zoomers[msg.chat.id].id);
            this.zoomers[msg.chat.id].id = 0;
            return;
        }

        // Interval gt zero - create zoomer
        if (interval > 0) {
            setInterval(() => bot.sendMessage(msg.chat.id, 'BZZZZ BZZZZ BZZZZ'), interval * 1000)
            bot.sendMessage(msg.chat.id, 'Zoomer started');
            return;
        }

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