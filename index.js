const Bot = require('./src/bot')
const { Keyboard, Buttons } = require('./src/keyboards-and-buttons')

const token = '856565326:AAFk5l23CC_OUk3pUOSoGKeUiDj_StpzLjs'
const bot = new Bot({ token })

//

/*bot.getUserProfilePhotos({ user_id: 839714887}).then(result => {
  console.log(result)
})*/

/*
bot.sendMessage({
  chat_id: 839714887,
  text: 'teste',
})*/

/*
bot.use((update)=>{
  console.log('----')
  console.log('update', update)
  console.log('----')
})

bot.on('update', (updates)=>{
  console.log(updates)
})*/

bot.on('message', async ctx => {
  /*ctx.reply(
    'valeu',
    Keyboard('inline', [
      Buttons.CallBack('acao 1', 'id-acao-1', { foo: 'bar' }, params => {
        console.log(params)
        ctx.editMsgWithKeyboard(
          'id-acao-1',
          Keyboard('inline', [
            Buttons.CallBack('acao 1.1', 'id-acao-1-1', null, () => {
              console.log('teste editar menu')
            }),
          ])
        )
      }),
      Buttons.CallBack('acao 2', 'id-acao-2', null, params => {
        console.log(params)
        //ctx.reply('id-acao-2')
      }),
    ])
  )*/
  /*ctx
    .reply('Quer uma foto?')
    .waitForReply(() => {

      ctx.reply({
        file: {
          type: 'photo',
          url: 'https://images.freeimages.com/images/large-previews/b31/butterfly-1392408.jpg',
          //filePath: './bitcoin.jpg',
        },
      })



      //ctx.reply('testando sem foto')
    })
    .waitForReply(() => {
      console.log('reply aconteceu 2')
      ctx.reply('reply 2')
    })*/
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
