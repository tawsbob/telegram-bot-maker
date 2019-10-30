require('./events')

const Updater = require('./updater')
const Telegram = require('./telegram-api')

const { Events } = global

class Bot extends Telegram {
  constructor(props) {
    super(props)
    this.Updater = new Updater(props)
    Events.setContexProps(props)
  }

  lauch() {
    this.Updater.lauch()
  }

  stop() {
    this.Updater.stop()
  }

  command(command, handler) {
    Events.command(command, handler)
  }

  on(listener, handler) {
    Events.on(listener, handler)
  }
}

module.exports = Bot
