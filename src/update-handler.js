const Telegram = require('./telegram-api')

class UpdateHandler extends Telegram {

    constructor(props){
        this.updateTrigger()
    }

    stop() {
        this.started = false
        clearTimeout(this.pollingTimeout)
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
}

module.exports = UpdateHandler