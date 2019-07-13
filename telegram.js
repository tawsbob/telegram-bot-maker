const client = require('./axio-client')



class Telegram {

  constructor({ token }) {
    this.baseUrl = 'https://api.telegram.org/'
    this.baseBotUrl = `${this.baseUrl}bot${token}/`
  }

  async apiCall({ method, params, endpoint }) {
    try {
      const url = this.baseBotUrl + endpoint
      const response = await client[method](url, params)

      if (response && response.data && response.data.result) {
        return response.data.result
      }

      return null

    } catch (e) {
      console.warn(e)
      return null
    }
  }

  getUpdate({ limit, offset, timeout }){
    return this.apiCall({ endpoint: `getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`, method: 'get'   })
  }
  getMe(){
      return this.apiCall({ endpoint: 'getMe', method: 'get' })
  }
  sendMessage(params) {
     return this.apiCall({ endpoint: 'sendMessage', method: 'post', params })
  }
  forwardMessage(params){
    return this.apiCall({ endpoint: 'forwardMessage', method: 'post', params })
  }
  sendPhoto(params){
    return this.apiCall({ endpoint: 'sendPhoto', method: 'post', params })
  }
  sendAudio(params){
    return this.apiCall({ endpoint: 'sendAudio', method: 'post', params })
  }
  sendDocument(params){
    return this.apiCall({ endpoint: 'sendDocument', method: 'post', params })
  }
  sendVideo(params){
    return this.apiCall({ endpoint: 'sendVideo', method: 'post', params })
  }
  sendAnimation(params){
    return this.apiCall({ endpoint: 'sendAnimation', method: 'post', params })
  }
  sendVoice(params){
    return this.apiCall({ endpoint: 'sendVoice', method: 'post', params })
  }
  sendVideoNote(params){
    return this.apiCall({ endpoint: 'sendVideoNote', method: 'post', params })
  }
  sendMediaGroup(params){
    return this.apiCall({ endpoint: 'sendMediaGroup', method: 'post', params })
  }

  sendLocation(params){
    return this.apiCall({ endpoint: 'sendLocation', method: 'post', params })
  }

  editMessageLiveLocation(params){
    return this.apiCall({ endpoint: 'editMessageLiveLocation', method: 'post', params })
  }

  stopMessageLiveLocation(params){
    return this.apiCall({ endpoint: 'stopMessageLiveLocation', method: 'post', params })
  }

  sendVenue(params){
    return this.apiCall({ endpoint: 'sendVenue', method: 'post', params })
  }


  sendContact(params){
    return this.apiCall({ endpoint: 'sendContact', method: 'post', params })
  }


  sendPoll(params){
    return this.apiCall({ endpoint: 'sendPoll', method: 'post', params })
  }


  sendChatAction(params){
    return this.apiCall({ endpoint: 'sendChatAction', method: 'post', params })
  }



}

class Bot {
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


}

module.exports = Telegram
