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
    .reply('Whats is your first name?')
    .waitForReply((userReply)=>{
      const { message } = userReply
      ctx.setState({ firstName: message.text })
      ctx.reply(`nice ${message.text}, so whats is your last name?`)
    })
    .waitForReply((userReply)=>{
      const { message } = userReply
      const { firstName } = ctx.getState()
      ctx.reply(`your full name is ${firstName} ${message.text}`)
    })
})

```

### Creating Menu

![Menu 2x1](https://github.com/tawsbob/telegram-bot-api/blob/master/docs/menu-exemple-1.png?raw=true)

```javascript

bot.on('message', ctx => {
  ctx.replyWithMenu({
    text: 'Menu Level 0', //Menu text
    grid: '2x1',          //Menu Grid *Required
    id: 'id-menu-0',      //Menu Id *Required
    options: [
      {
        label: 'Button 1', //BUTTON LABEL *Required
        id: 'btn-1',       //BUTTON ID *Required
        params: { 'my-custom-params': 'my-custom-value' }, //If you want add params to the button
        onSelect: params => {
          console.log('Button 1 click', params)
        },                //On User Click to the button
      },
      {
        label: 'Button 2',
        id: 'btn-2',
        onSelect: params => {
          console.log('Button 2 click')
        },
      },
    ],
  })

})

```


## Notes
All updates that remain when the bot is off will be bypassed, it will only react to updates that happen while it is alive, I choose for this architecture to prevent anomalous behavior.
