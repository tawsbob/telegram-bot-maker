const Context = require('./context')
const Telegram = require('./telegram-api')

const callbackDataStringify = (callback_id, params)=>`${callback_id}>${JSON.stringify(params)}`

const callbackDataParse = (callback_data)=>{

  const withParams = callback_data.split('>')
  let params = null

  console.log(callback_data, withParams)

  if(withParams.length > 1){
      params = JSON.parse(withParams[1])
      return { callback_data: withParams[0], params }
  }

  return { callback_data, params }
}

class Buttons {
  constructor(bot) {
    this.bot = bot
  }

  withParams(params, callback_id){
    if(params && typeof params === 'object'){
      return callbackDataStringify(callback_id, params)
    }
    return callback_id
  }

  CallBack(text, callback_id, params, handdler, hide = false){

    const callback_data = params ? this.withParams(params, callback_id) : callback_id

    if (handdler) {
      this.bot.setCallback_query(callback_data, handdler)
    }
    return {
      text,
      callback_data,
      hide,
    }
  }
  Keyboard(text, opts = null) {
    return {
      text,
      ...opts,
    }
  }
}

const Keyboard = (type = 'inline', buttons, opts) => {
  if (type === 'inline') {
    return { reply_markup: { inline_keyboard: [buttons] } }
  }

  const options = opts ? opts : { resize_keyboard: true, one_time_keyboard: true }
  return { reply_markup: { keyboard: [buttons], ...options } }
}

class Bot extends Telegram {
  constructor(props) {
    super(props)
    const { polling = true } = props

    this.polling = polling
    this.pollingTimeout = null
    this.updateInterval = 500
    this.started = false

    this.listeners = {
      message: null,
      update: null,
      command: [],
      callback_query: [],
      reply: [],
      middleware: [],
    }

    this.props = props
    this.offset = 0

    this.Buttons = new Buttons(this)
    this.Keyboard = Keyboard
    this.onReply = this.setReplyListener.bind(this)
  }

  lauch() {
    this.started = true
    this.updateTrigger()
  }

  updateTrigger() {
    this.pollingTimeout = setTimeout(this.lookingForUpdates, this.updateInterval)
  }

  async lookingForUpdates() {
    if (!this.started) {
      return
    }

    try {
      const { offset } = this
      const updates = await this.getUpdate({ offset, limit: 600 })

      if (updates && updates.length) {
        //https://core.telegram.org/bots/api#getting-updates
        //Must be greater by one than the highest among the identifiers of previously received updates
        this.offset = updates[updates.length - 1].update_id + 1
      }

      if (updates && updates.length) {
        if (this.listeners.update) {
          this.listeners.update(updates)
        }
        this.check(updates)
      }
      this.updateTrigger()
    } catch (e) {
      console.warn(e)
    }
  }

  callMiddlewares(update) {
    const length = this.listeners.middleware.length

    for (let i = 0; i < length; i++) {
      this.listeners.middleware[i](update)
    }
  }

  check(updates) {
    const length = updates.length

    for (let i = 0; i < length; i++) {
      this.callMiddlewares(updates[i])
      this.checkUpdate(updates[i], updates.length - 1 == i)
    }
  }

  checkUpdate(update, isLast) {
    if (update.callback_query) {
      const { data } = update.callback_query
      this.triggerCallBackQueryListeners(data, update)
    }

    if (update.message) {
      const { message } = update
      const { text, entities } = message

      //commands are trigger here
      const isCommand = this.checkEntities(entities, text, update)

      if (!isCommand) {
        //se tem reply e se é para o usuário correto
        this.makeReply(update, isLast)
      }
    }
  }

  updateMatchRef(update, ref) {
    return (
      ref.message_id < update.message.message_id &&
      ref.chat_id == update.message.chat.id &&
      ref.from_id == update.message.from.id
    )
  }

  matchRef(ref, _ref) {
    return ref.message_id == _ref.message_id && ref.chat_id == _ref.chat_id && ref.from_id == _ref.from_id
  }

  makeReply(update, isLast) {
    const length = this.listeners.reply.length
    let mustReply = false

    let toDelete = []

    for (let i = 0; i < length; i++) {
      const replyListener = this.listeners.reply[i]

      if (update.message && replyListener.ref && this.updateMatchRef(update, replyListener.ref)) {
        mustReply = true
        replyListener.handdler()
        replyListener.addUpdate(update)
        toDelete.push(replyListener.ref)
      }
    }

    if (!mustReply) {
      this.triggerMsgListener(update)
    }

    if (isLast) {
      const lastIndex = this.listeners.reply.length - 1

      this.listeners.reply = this.listeners.reply.reduce((acc, listener) => {
        const isInDeleteList = toDelete.reduce((_acc, _ref) => {
          if (this.matchRef(listener.ref, _ref)) return acc
        }, false)

        if (!isInDeleteList) {
          acc.push(listener)
        }

        return acc
      }, [])
    }
  }

  checkEntities(entities, text, update) {
    let isCommand = false
    if (entities && entities.length) {
      const length = entities.length
      for (let i = 0; i < length; i++) {
        if (entities[i].type === 'bot_command') {
          this.emit(text.trim(), update)
          isCommand = true
        }
      }
    }

    return isCommand
  }

  stop() {
    this.started = false
    clearTimeout(this.pollingTimeout)
  }

  removeReplyListenersFromThisRef(ref) {
    if (ref) {
      const { chat_id, from_id } = ref
      this.listeners.reply = this.listeners.reply.reduce((acc, l) => {
        if (chat_id == l.ref.chat_id && from_id == l.ref.from_id) {
          console.log('removendo listenerS')
        } else {
          acc.push(l)
        }

        return acc
      }, [])
    }
  }

  triggerCallBackQueryListeners(data, update) {
    const length = this.listeners.callback_query.length
    for (let i = 0; i < length; i++) {
      if (this.listeners.callback_query[i].data === data) {
        this.listeners.callback_query[i].handdler(
          callbackDataParse(this.listeners.callback_query[i].data)
        )
      }
    }
  }

  triggerMsgListener(update) {
    if (this.listeners.message) {
      this.listeners.message(new Context({ ...this.props, update, onReply: this.onReply }))
    }
  }

  emit(command, update) {
    const length = this.listeners.command.length
    for (let i = 0; i < length; i++) {
      if (this.listeners.command[i].command === command) {
        this.listeners.command[i].handdler(new Context({ ...this.props, update, onReply: this.onReply }))
      }
    }
  }

  command(command, handdler) {
    this.listeners.command.push({ command, handdler })
  }

  setCallback_query(data, handdler) {
    this.listeners.callback_query.push({ data, handdler })
  }

  setReplyListener(ref, handdler, addUpdate) {
    this.removeReplyListenersFromThisRef(ref)
    this.listeners.reply.push({ ref, handdler, addUpdate })
  }

  on(listener, handdler) {
    if (this.listeners[listener] !== 'undefined') {
      this.listeners[listener] = handdler
    }
  }

  use(handdler) {
    this.listeners.middleware.push(handdler)
  }
}

module.exports = {
  Bot,
  Keyboard,
  Buttons,
}
