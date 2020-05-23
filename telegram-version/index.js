const OAuth = require('oauth');
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const token = ''; // telegram bot token

const bot = new Telegraf(token)

const twitter_application_consumer_key = '';  // API Key
const twitter_application_secret = '';  // API Secret
const twitter_user_access_token = '';  // Access Token
const twitter_user_secret = '';  // Access Token Secret

let oauth = new OAuth.OAuth(
	'https://api.twitter.com/oauth/request_token',
	'https://api.twitter.com/oauth/access_token',
	twitter_application_consumer_key,
	twitter_application_secret,
	'1.0A',
	null,
	'HMAC-SHA1'
);

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  console.log(`(Response Time: ${response_time})`)
})

bot.on('message', (ctx) => {    

  ctx.reply('Got it! I will check back tomorrow to see if you are still alive!')
  lastword = ctx.update.message.text
  console.log(lastword)
  function myFunc() {
    ctx.reply('Are you still alive?',
    Extra.HTML()
    .markup(Markup.inlineKeyboard([
      Markup.callbackButton('Im ALIVE', 'alive'),
      Markup.callbackButton('Im dead.', 'dead')
    ])))
  }
  setTimeout(myFunc, 5000); // function waits 5000 milliseconds before asking
  
})
bot.action('alive', (ctx) => {
  ctx.editMessageText('<i>Message will not be posted.😊</i>',
    Extra.HTML())
})
bot.action('dead', (ctx) => {
  ctx.editMessageText('<i>Message posted! Enjoy your death!</i>',
    Extra.HTML())
    
    console.log("Your last words were: " + lastword)
    let postBody = {
      'status': lastword
      };

    console.log("Sending Tweet...")
    oauth.post('https://api.twitter.com/1.1/statuses/update.json',
    twitter_user_access_token,  // oauth_token (user access token)
    twitter_user_secret,  // oauth_secret (user secret)
    postBody,  // post body
    '',  // post content type 
    function(err, data, res) {
        if (err) {
            console.log(err);
        } else {
            // console.log(data);
        }
    });
})
bot.launch()


