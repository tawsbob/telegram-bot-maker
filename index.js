const { Bot, Keyboard, Buttons } = require('./telegram')

const token = '856565326:AAFk5l23CC_OUk3pUOSoGKeUiDj_StpzLjs'
const bot = new Bot({ token })

/*
bot.getUserProfilePhotos({ user_id: 839714887}).then(result => {
  console.log(result)
})*/

/*
bot.getUpdate({ offset: 0, limit: 10, timeout: 2000 }).then(result => {
  console.log(JSON.stringify(result))
})*/

/*
bot.sendMessage({
  chat_id: 839714887,
  text: 'teste',
})*/

bot.on('message', (update, ctx, onReply) => {
  /*ctx.reply(
    'valeu',
    Keyboard('inline', [
      bot.Buttons.CallBack('acao 1', 'id-acao-1', (cb, _ctx) => {
        _ctx.reply('id-acao-1')
      }),
      bot.Buttons.CallBack('acao 2', 'id-acao-2', (cb, _ctx) => {
        _ctx.reply('id-acao-2')
      }),
    ])
  )*/

  console.log(update.message.text)
  ctx.reply(`valeu ${update.message.from.first_name}`)

  //context.ref() is required because is the reference to know when reply
  onReply(ctx.ref(), (up, _ctx, _onReply) => {
    console.log('me respondeu certinho 1')
    _ctx.reply('reply 1')

    _onReply(_ctx.ref(), (__, __ctx) => {
      console.log('certinho 2')
      __ctx.reply('reply 2')
    })
  })
})

/*
bot.command('/menu', () => {
  console.log('menu ativado')
})
bot.command('/analises', () => {
  console.log('analises ativado')
})*/

bot.lauch()
