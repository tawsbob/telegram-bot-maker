const { Bot } = require('./src')

const token = '856565326:AAFk5l23CC_OUk3pUOSoGKeUiDj_StpzLjs'
const bot = new Bot({ token })
console.log('aqui')
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

bot.on('message', ctx => {


  ctx
    .reply('What a photo?')
    .waitForReply(() => {

      ctx.replyWithImage({
        file: {
          type: 'photo',
          //url: 'https://images.freeimages.com/images/large-previews/b31/butterfly-1392408.jpg',
          filePath: './docs/menu-exemple-1.png',
        },
      })

    })

  /*ctx.reply(
    'Testing custom BTNS',
    ctx.keyboard(null, [
      [
        ctx.buttons.CallBack('Button 1', 'id-btn-1', { params: 'to-btn-1' }, params => {
          console.log('User hit button 1', params)
        }),
      ],
      [
        ctx.buttons.CallBack('Button 2', 'id-btn-2', { params: 'to-btn-2' }, params => {
          console.log('User hit button 2', params)
        }),
      ],
    ])
  )*/

  /*ctx
    .reply('Whats is your first name?')
    .waitForReply(userReply => {
      const { message } = userReply
      ctx.setState({ firstName: message.text })
      ctx.reply(`nice ${message.text}, so whats is your last name?`)
    })
    .waitForReply(userReply => {
      const { message } = userReply
      const { firstName } = ctx.getState()
      ctx.reply(`your full name is ${firstName} ${message.text}`)
    })*/

  /*ctx.replyWithMenu({
    text: 'Menu Level 0',
    grid: '2x1',
    id: 'id-menu-0',
    options: [
      {
        label: 'Button 1',
        id: 'btn-1',
        params: { 'my-custom-params': 'my-custom-value' },
        onSelect: params => {
          console.log('Button 1 click', params)
        },
      },
      {
        label: 'Button 2',
        id: 'btn-2',
        onSelect: params => {
          console.log('Button 2 click')
        },
        submenu: {
          text: 'Menu Level 1',
          grid: '1x1',
          id: 'id-menu-1',
          backButton: {
            label: 'Back to level zero menu',
            id: 'id-menu-0',
          }, // Add at the bottom of grid a back button
          options: [
            {
              label: 'Button 3',
              id: 'btn-3',
              onSelect: params => {
                console.log('Button 3 click')
              },
            },
            {
              label: 'Button 4',
              id: 'btn-4',
              onSelect: params => {
                console.log('Button 4 click')
              },
            },
          ],
        },
      },
    ],
  })

  /*ctx.replyWithMenu({
    text: 'Menu Level 0',
    grid: '2x1',
    id: 'id-menu-0',
    options: [
      {
        label: 'Button 1',
        id: 'btn-1',
        params: { 'my-custom-params': 'my-custom-value' },
        onSelect: params => {
          console.log(params)
        },
      },
      {
        label: 'Button 2',
        id: 'btn-2',
        submenu: {
          text: 'Menu Level 1',
          grid: '2x1',
          id: 'id-menu-1',
          backButton: {
            label: 'Back to level zero menu',
            id: 'id-menu-0',
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
                id: 'id-menu-3',
                backButton: {
                  label: 'Back to prevLevel',
                  id: 'id-menu-2',
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
  })*/

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
