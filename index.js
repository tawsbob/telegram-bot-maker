const { Bot, Keyboard, Buttons } = require('./src/bot')

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

bot.on('message', async ctx => {
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

  //console.log(update.message.text)

  ctx
    .reply(`valeu ${ctx.getLast().message.from.first_name}`)
    .waitForReply(() => {
      console.log('reply aconteceu 1')
      ctx.reply('reply 1')
    })
    .waitForReply(() => {
      console.log('reply aconteceu 2')
      ctx.reply('reply 2')
    })
})

bot.command('/menu', async ctx => {
  
  ctx.reply('voce está on menu').waitForReply(() => {
    ctx.reply('reply menu')
  })
  
})

/*
bot.command('/analises', () => {
  console.log('analises ativado')
})*/

bot.lauch()
