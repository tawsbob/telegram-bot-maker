const Telegram = require('./telegram-api')

const { Events } = global

class Updater extends Telegram {
  constructor(props) {
    super(props)
    const {updateInterval } = props
    this.pollingTimeout = null
    this.updateInterval =  updateInterval || 350
    this.started = false
    this.offset = 0
  }

  stop() {
    this.started = false
    clearTimeout(this.pollingTimeout)
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
        Events.onUpdate(updates)
        this.check(updates)
      }

      this.updateTrigger()
    } catch (e) {
      console.warn(e)
    }
  }

  check(updates) {
    const length = updates.length

    for (let i = 0; i < length; i++) {
      Events.callMiddlewares(updates[i])
      this.checkUpdate(updates[i], updates.length - 1 == i)
    }
  }

  checkUpdate(update, isLast) {
    if (update.callback_query) {
      const { data } = update.callback_query
      Events.triggerCallBackQueryListeners(data, update)
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
    const length = Events.listeners.reply.length
    let mustReply = false

    let toDelete = []

    for (let i = 0; i < length; i++) {
      const replyListener = Events.listeners.reply[i]

      if (update.message && replyListener.ref && this.updateMatchRef(update, replyListener.ref)) {
        mustReply = true
        replyListener.handdler(update)
        replyListener.addUpdate(update)
        toDelete.push(replyListener.ref)
      }
    }

    if (!mustReply) {
      Events.triggerMsgListener(update)
    }

    if (isLast) {
      const lastIndex = Events.listeners.reply.length - 1

      const FilteredListeners = Events.listeners.reply.reduce((acc, listener) => {
        const isInDeleteList = toDelete.reduce((_acc, _ref) => {
          if (this.matchRef(listener.ref, _ref)) return acc
        }, false)

        if (!isInDeleteList) {
          acc.push(listener)
        }

        return acc
      }, [])

      Events.replaceRepliesListeners(FilteredListeners)
    }
  }

  checkEntities(entities, text, update) {
    let isCommand = false
    if (entities && entities.length) {
      const length = entities.length
      for (let i = 0; i < length; i++) {
        if (entities[i].type === 'bot_command') {
          Events.emit(text.trim(), update)
          isCommand = true
        }
      }
    }

    return isCommand
  }
}

module.exports = Updater
