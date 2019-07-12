const client = require('./axio-client')

const BotMehods = {
  getUpdates: ({ limit = 10, offset = 0, timeout = 20000 }) =>
    `getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`,
}

class Telegram {
  //'https://api.telegram.org'
  constructor({ token, polling = true }) {
    this.token = token
    this.polling = polling
    this.baseUrl = 'https://api.telegram.org/'
    this.baseBotUrl = `${this.baseUrl}bot${token}/`
    this.pollingTimeout = null
    this.updateInterval = 1500
    this.started = false
    this.updates = []

    //resolver isso depois
    this.getUpdate = this.getUpdate.bind(this)
  }

  lauch() {
    this.started = true
    this.pollingTimeout = setTimeout(this.getUpdate, this.updateInterval)
  }

  emit() {
    const length = this.updates.length
    for (let i = 0; i > length; i++) {
      this.updates[i]
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

  async getUpdate() {
    const params = this.getUpdateParams()

    try {
      const apiResponse = await client.get(this.botMethodUrl('getUpdates', params))

      if (apiResponse && apiResponse.data && apiResponse.data.result) {
        console.log(JSON.stringify(apiResponse.data.result))
        this.updates.push(apiResponse.data.result)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Telegram
