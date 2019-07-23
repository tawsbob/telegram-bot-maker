const Telegram = require('./telegram-api')
const { Events } = global

class Context extends Telegram {
  constructor(props) {
    const { update, setReplyListener } = props
    super(props)
    this.state = {}
    this.updates = [update]
    this.lastBotMsg = null
    this.replyListeners = []
    this._addUpdate = this.addUpdate.bind(this)
    this.setReplyListener = setReplyListener
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

  ref() {
    //new error if not message_id
    const message_id = this.lastBotMsg.message_id

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
    const { message_id } = this.lastBotMsg
    this.editMessageText(
      this.contextParams({
        text,
        message_id,
        ...params,
      })
    )
  }

  buildMenu(MenuConfiguration) {}

  replyWithMenu(MenuConfiguration) {}

  afterBotReply(lastBotMsg) {
    this.lastBotMsg = lastBotMsg
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
