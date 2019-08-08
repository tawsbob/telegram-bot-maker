const Telegram = require('./telegram-api')

class Context extends Telegram {
  constructor(props) {
    const { update, setReplyListener, Keyboard, Buttons } = props
    super(props)
    this.state = {}
    this.updates = [update]
    this.lastBotMsg = []
    this.replyListeners = []
    this._addUpdate = this.addUpdate.bind(this)
    this.setReplyListener = setReplyListener
    ;(this.keyboard = Keyboard), (this.buttons = Buttons)
  }

  getType() {
    const { callback_query, message } = this.getLastUpdate()
    if (callback_query) {
      return 'callback_query'
    }

    if (message) {
      return 'message'
    }

    return null
  }

  addUpdate(update) {
    this.updates.push(update)
  }

  getLastUpdate() {
    return this.updates[this.updates.length - 1]
  }

  getInsideObj() {
    return this.getLastUpdate()[this.getType()]
  }

  getFromId() {
    return this.getInsideObj().from.id
  }

  getChatId() {
    const { chat, message } = this.getInsideObj()

    if (chat) {
      return chat.id
    }

    if (message.chat.id) {
      return message.chat.id
    }
  }

  getLastBotMsg() {
    return this.lastBotMsg[this.lastBotMsg.length - 1]
  }

  ref() {
    //new error if not message_id
    const { message_id } = this.getLastBotMsg()

    return {
      message_id,
      chat_id: this.getChatId(),
      from_id: this.getFromId(),
    }
  }

  contextParams(params) {
    const { file, ...rest } = params

    if (file) {
      return {
        file,
        body: {
          chat_id: this.getChatId(),
          ...rest,
        },
      }
    }

    return {
      body: {
        chat_id: this.getChatId(),
        ...params,
      },
    }
  }

  reply(text, params) {
    this.sendMessage(this.contextParams({ text, ...params }))
      .then(this.afterBotReply)
      .catch(console.warn)
    return this
  }

  replyWithImage(params) {
    this.sendPhoto(this.contextParams(params))
      .then(this.afterBotReply)
      .catch(console.warn)
    return this
  }

  editMsgWithKeyboard(text, params) {
    const { message_id } = this.getLastBotMsg()
    this.editMessageText(
      this.contextParams({
        text,
        message_id,
        ...params,
      })
    )
      .then(this.afterBotReply)
      .catch(console.warn)
    return this
  }

  backClick() {
    //tem que ver como eu vou resolver isso aqui
    this.lastBotMsg.map()

    const offSetOneLastMsg = [this.lastBotMsg.length - 2]
    const { text, reply_markup } = offSetOneLastMsg

    this.editMsgWithKeyboard(text, { reply_markup })
  }

  subMenuReply(text, menu) {
    return () => {
      this.editMsgWithKeyboard(text, menu)
    }
  }

  buildButton(opts, isBack) {
    const { label, id, params = null, onSelect, hide, submenu } = opts

    if (submenu) {
      const { text } = submenu
      const _submenuMarkUp = this.buildMenu(submenu)
      return this.buttons.CallBack(label, id, params, this.subMenuReply(text, _submenuMarkUp), hide)
    }

    if (isBack) {
      return this.buttons.CallBack(label, id, params, this.backClick, hide)
    }

    return this.buttons.CallBack(label, id, params, onSelect, hide)
  }

  buildGrid(grid, options, backButton) {
    const rowsAndCols = grid.split('x')
    const rows = parseInt(rowsAndCols[0])
    const cols = parseInt(rowsAndCols[1]) || 0

    let filledRows = 0
    let filledCols = 0

    const elements = options.reduce((acc, opts, i) => {
      if (filledRows < rows) {
        if (!acc.length) {
          acc.push([this.buildButton(opts)])
        } else {
          acc[filledCols].push(this.buildButton(opts))
        }
        filledRows++

        if (filledRows == rows) {
          filledRows = 0
          filledCols++
          if (i < options.length - 1) {
            acc.push([])
          }
        }

        if (i == options.length - 1) {
          if (backButton) {
            acc.push([this.buildButton(backButton, true)])
          }
        }
      }

      return acc
    }, [])

    return elements
  }

  buildMenu(MenuConfiguration) {
    const { options, grid, backButton } = MenuConfiguration
    const menu = this.buildGrid(grid, options, backButton)
    return this.keyboard('inline', menu)
  }

  replyWithMenu(MenuConfiguration) {
    const { text } = MenuConfiguration
    const markup = this.buildMenu(MenuConfiguration)
    this.reply(text, markup)
  }

  afterBotReply(lastBotMsg) {
    this.lastBotMsg.push(lastBotMsg)
    console.log(this.lastBotMsg.length)
    this.triggerBotReply()
  }

  triggerBotReply() {
    if (this.replyListeners.length) {
      this.setReplyListener(this.ref(), this.replyListeners[0], this._addUpdate)
      this.clearFirstReplyListener()
    }
  }

  clearFirstReplyListener() {
    if (this.replyListeners.length > 1) {
      this.replyListeners = this.replyListeners.filter((l, i) => i > 0)
    } else {
      this.replyListeners = []
    }
  }

  waitForReply(listener) {
    this.replyListeners.push(listener)
    return this
  }
}

module.exports = Context
