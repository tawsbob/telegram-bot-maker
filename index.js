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


bot.on('message', (update, ctx) => {
  ctx.reply('valeu',
    Keyboard('inline', [
      bot.Buttons.CallBack('acao 1', 'id-acao-1', (cb, _ctx)=>{ ctx.reply('id-acao-1') }),
      bot.Buttons.CallBack('acao 2', 'id-acao-2', (cb, _ctx)=>{ ctx.reply('id-acao-2') })
    ])
  )
})

/*
bot.command('/menu', () => {
  console.log('menu ativado')
})
bot.command('/analises', () => {
  console.log('analises ativado')
})*/

bot.lauch()
