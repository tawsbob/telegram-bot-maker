const Telegram = require('./telegram')

const token = '856565326:AAFk5l23CC_OUk3pUOSoGKeUiDj_StpzLjs'
const telegraClient = new Telegram({ token })

telegraClient.getUpdate({ limit:10, offset: 0, timeout: 20000 }).then((result)=>{
  console.log(result)
})

/*
telegraClient.sendMessage({
  chat_id: 839714887,
  text: 'teste',
})*/

/*telegraClient.lauch()
telegraClient.command('/menu', () => {
  console.log('menu ativado')
})
telegraClient.command('/analises', () => {
  console.log('analises ativado')
})

telegraClient.sendMessage()*/
