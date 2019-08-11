const Bot = require('./src/bot')

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
  ctx.replyWithMenu({
    text: 'Menu Experimental',
    grid: '2x1',
    options: [
      {
        label: 'create new account',
        id: 'create-acc',
        params: { 'my-custom-params': 'my-custom-value' },
        onSelect: params => {
          console.log('1', params)
        },
      },
      {
        label: 'menu 2',
        id: 'menu-2',
        params: { 'my-custom-params-2': 'my-custom-value-2' },
        submenu: {
          text: 'Textando submenu 2',
          grid: '2x1',
          backButton: {
            label: 'Back to main menu',
            id: 'back-to-main',
          },
          options: [
            {
              label: 'menu 3',
              id: 'menu-3',
            },
            {
              label: 'menu 4',
              id: 'menu-4',
              submenu: {
                text: 'Textando submenu 3',
                grid: '1x1',
                backButton: {
                  label: 'Back to prevLevel',
                  id: 'back-to-prev-level',
                },
                options: [
                  {
                    label: 'menu 5',
                    id: 'menu-5',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  })

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
  ctx
    .reply('whats is your first name?')
    .waitForReply(userReply => {
      const { message, update_id } = userReply
      //console.log(update_id, message.text, message.message_id)
      const firstName = message.text
      ctx.reply(`Nice ${firstName}, so whats is your last name?`)
    })
    .waitForReply(userReply => {
      const { message, update_id } = userReply
      const lastName = message.text
      console.log(lastName)
    })
})

/*
bot.command('/analises', () => {
  console.log('analises ativado')
})*/

bot.lauch()
