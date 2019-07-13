const Telegram = require('./telegram')

const token = '856565326:AAFk5l23CC_OUk3pUOSoGKeUiDj_StpzLjs'
const telegraClient = new Telegram({ token })

/*
telegraClient.getUserProfilePhotos({ user_id: 839714887}).then(result => {
  console.log(result)
})*/

/*
telegraClient.getUpdate({ offset: 0, limit: 10, timeout: 2000 }).then(result => {
  console.log(JSON.stringify(result))
})*/

/*
telegraClient.sendMessage({
  chat_id: 839714887,
  text: 'teste',
})*/

telegraClient.on('message', (update, ctx) => {
  ctx.reply('valeu')
})
telegraClient.command('/menu', () => {
  console.log('menu ativado')
})
telegraClient.command('/analises', () => {
  console.log('analises ativado')
})

telegraClient.lauch()
