const client = require('./axio-client')

const BotMehods = {
  getUpdates: ({ limit = 10, offset = 0, timeout = 20000 }) =>
    `getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`,
    sendMessage: ()=> 'sendMessage'
}

class Telegram {
  constructor({ token, polling = true }) {
    this.token = token
    this.polling = polling
    this.baseUrl = 'https://api.telegram.org/'
    this.baseBotUrl = `${this.baseUrl}bot${token}/`
    this.pollingTimeout = null
    this.updateInterval = 1500
    this.started = false

    this.listeners = []

    //resolver isso depois
    this.getUpdate = this.getUpdate.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  lauch() {
    this.started = true
    this.pollingTimeout = setTimeout(this.getUpdate, this.updateInterval)
  }

  check(updates) {
    const length = updates.length
    for (let i = 0; i < length; i++) {
      this.checkUpdate(updates[i])
    }
  }

  checkUpdate(update) {
    const { message } = update
    const { text, entities } = message

    this.checkEntities(entities, text)
  }
  checkEntities(entities, text) {
    if (entities && entities.length) {
      const length = entities.length
      for (let i = 0; i < length; i++) {
        if (entities[i].type === 'bot_command') {
          this.emit(entities[i].type, text)
        }
      }
    }
  }

  stop() {
    this.started = false
    clearTimeout(this.pollingTimeout)
  }

  botMethodUrl(method, params) {
    return this.baseBotUrl + BotMehods[method](params)
  }

  getUpdateParams() {
    return {}
  }

  emit(type, command) {
    const length = this.listeners.length
    for (let i = 0; i < length; i++) {
      if (this.listeners[i].type === type && this.listeners[i].command === command) {
        this.listeners[i].handdler(command)
      }
    }
  }

  async getUpdate() {
    const params = this.getUpdateParams()

    try {
      const apiResponse = await client.get(this.botMethodUrl('getUpdates', params))

      if (apiResponse && apiResponse.data && apiResponse.data.result) {
        this.check(apiResponse.data.result)
      }
    } catch (e) {
      console.log(e)
    }
  }

  
  command(command, handdler) {
    this.listeners.push({ type: 'bot_command', command, handdler })
  }

  async sendMessage(){
      //{ chat_id, text, parse_mode, disable_web_page_preview, disable_notification, reply_to_message_id, reply_markup }
      try {
        const response = await client.post(
            this.botMethodUrl('sendMessage'),
            {
                chat_id: 839714887,
                text: 'teste'
            }
        )
        console.log(response)
      } catch(e){
          console.log(e)
      }
  }

}

module.exports = Telegram
