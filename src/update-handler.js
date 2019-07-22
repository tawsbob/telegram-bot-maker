const Telegram = require('./telegram-api')

const { Events } = global

class UpdateHandler extends Telegram {
  constructor(props) {
    super(props)
    this.pollingTimeout = null
    this.updateInterval = 500
    this.started = false

    this.updateTrigger()
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
        Events.emit('update', updates)
      }
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = UpdateHandler
