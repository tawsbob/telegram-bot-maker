const EventEmitter = require('events')

const Events = new EventEmitter()

function checkUpdate(update, isLast) {
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

function checkUpdates(updates) {
  const length = updates.length

  for (let i = 0; i < length; i++) {
    //this.callMiddlewares(updates[i])
    this.checkUpdate(updates[i], updates.length - 1 == i)
  }
}

function UpdateListener(updates) {
  checkUpdates(updates)
}

Events.addListener('update', UpdateListener)

module.exports = global.Events = Events
