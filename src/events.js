const autoBind = require('auto-bind')
const Context = require('./context')
const buildKeyboardAndButtons = require('./keyboards-and-buttons')
const { callbackDataParse } = require('./utils')

class Events {
  constructor() {
    const { Keyboard, Buttons } = buildKeyboardAndButtons(this)
    this.listeners = {
      message: null,
      update: null,
      command: [],
      callback_query: [],
      reply: [],
      middleware: [],
    }
    this.contextProps = null
    this.Keyboard = Keyboard
    this.Buttons = Buttons
    autoBind(this)
  }

  setContexProps(props) {
    this.contextProps = props
  }

  replaceRepliesListeners(listeners) {
    this.listeners.reply = listeners
  }

  onUpdate(updates) {
    if (this.listeners.update) {
      this.listeners.update(updates)
    }
  }

  callMiddlewares(update) {
    const length = this.listeners.middleware.length

    for (let i = 0; i < length; i++) {
      this.listeners.middleware[i](update)
    }
  }

  removeReplyListenersFromThisRef(ref) {
    if (ref) {
      const { chat_id, from_id } = ref
      this.listeners.reply = this.listeners.reply.reduce((acc, l) => {
        if (chat_id == l.ref.chat_id && from_id == l.ref.from_id) {
          //console.log('removendo listenerS')
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
        this.listeners.callback_query[i].handdler(callbackDataParse(this.listeners.callback_query[i].data))
      }
    }
  }

  triggerMsgListener(update) {
    if (this.listeners.message) {
      this.listeners.message(this.newContex(update), update)
    }
  }

  emit(command, update) {
    const length = this.listeners.command.length
    for (let i = 0; i < length; i++) {
      if (this.listeners.command[i].command === command) {
        const { setReplyListener } = this
        this.listeners.command[i].handdler(this.newContex(update), update)
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

  newContex(update) {
    const { setReplyListener, Keyboard, Buttons } = this
    const contextProps = { ...this.contextProps, update, setReplyListener, Keyboard, Buttons }
    return new Context(contextProps)
  }
}

module.exports = global.Events = new Events()
