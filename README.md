# telegram-bot-api

A nodejs lightweight library wrapper to [telegram bot api](https://core.telegram.org/bots/api)


## How did it come about?

After try make may own bot with currents nodejs libraries ( Telegraf  and others)  and face some issues like:

- Uncaught exception
- Bugs,  memory leaks
- About weeks to accept pull request with bugfix
- Very verbose to work listening to answers and creating buttons / menus


## Requirements

- Nodejs V8 +

## Limitations
It's only for long polling bot, **Webhook** will be implemented soon.

## Usage

```javascript

const Bot = require('telegram-bot-api')

const bot = new Bot({
    token: 'YOUR-BOT-TOKEN',  
    updateInterval: 500, // time that bot will
  })

bot.lauch()

```

### Commands

```javascript

bot.command('/menu', ctx => {
  ctx.reply('There is a reply to menu command')
})

```

### Message

```javascript

bot.on('message', ctx => {
  ctx.reply('A reply to your msg')
})

```

### Wait For User reply

```javascript

bot.on('message', ctx => {

  ctx
    .reply('whats is your first name?')
    .waitForReply((userReply) => {
      const { message, update_id } = userReply
      //console.log(update_id, message.text, message.message_id)
      const firstName = message.text
      ctx.reply(`Nice ${firstName}, so whats is your last name?`)
    })
    .waitForReply((userReply) => {
      const { message, update_id } = userReply
      const lastName = message.text
      console.log(lastName)
    })
})

```


## Notes
All updates that remain when the bot is off will be disregarded, it will only react to updates that happen while it is alive, I choose for this architecture to prevent anomalous behavior.
