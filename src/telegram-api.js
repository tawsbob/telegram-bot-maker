const queryString = require('query-string')
const autoBind = require('auto-bind')
const client = require('./http-client')

class Telegram {
  constructor({ token }) {
    this.baseUrl = 'https://api.telegram.org/'
    this.baseBotUrl = `${this.baseUrl}bot${token}/`
    autoBind(this)
  }

  async apiCall({ method, params, endpoint }) {
    try {
      const url = this.baseBotUrl + endpoint
      const { body } = await client({ url, method, ...params })

      //thats is necessary because GOT (http request module) cant work with JSON module when body is form data
      const jsonResult = typeof body == 'string' ? JSON.parse(body) : body

      if (jsonResult && jsonResult.result) {
        return jsonResult.result
      }

      return null
    } catch (e) {
      console.warn(e)
      return null
    }
  }

  getUpdate(params) {
    return this.apiCall({ endpoint: `getUpdates?${queryString.stringify(params)}`, method: 'get' })
  }
  getMe() {
    return this.apiCall({ endpoint: 'getMe', method: 'get' })
  }
  sendMessage(params) {
    return this.apiCall({ endpoint: 'sendMessage', method: 'post', params })
  }
  forwardMessage(params) {
    return this.apiCall({ endpoint: 'forwardMessage', method: 'post', params })
  }
  sendPhoto(params) {
    return this.apiCall({ endpoint: 'sendPhoto', method: 'post', params })
  }
  sendAudio(params) {
    return this.apiCall({ endpoint: 'sendAudio', method: 'post', params })
  }
  sendDocument(params) {
    return this.apiCall({ endpoint: 'sendDocument', method: 'post', params })
  }
  sendVideo(params) {
    return this.apiCall({ endpoint: 'sendVideo', method: 'post', params })
  }
  sendAnimation(params) {
    return this.apiCall({ endpoint: 'sendAnimation', method: 'post', params })
  }
  sendVoice(params) {
    return this.apiCall({ endpoint: 'sendVoice', method: 'post', params })
  }
  sendVideoNote(params) {
    return this.apiCall({ endpoint: 'sendVideoNote', method: 'post', params })
  }
  sendMediaGroup(params) {
    return this.apiCall({ endpoint: 'sendMediaGroup', method: 'post', params })
  }

  sendLocation(params) {
    return this.apiCall({ endpoint: 'sendLocation', method: 'post', params })
  }

  editMessageLiveLocation(params) {
    return this.apiCall({ endpoint: 'editMessageLiveLocation', method: 'post', params })
  }

  stopMessageLiveLocation(params) {
    return this.apiCall({ endpoint: 'stopMessageLiveLocation', method: 'post', params })
  }

  sendVenue(params) {
    return this.apiCall({ endpoint: 'sendVenue', method: 'post', params })
  }

  sendContact(params) {
    return this.apiCall({ endpoint: 'sendContact', method: 'post', params })
  }

  sendPoll(params) {
    return this.apiCall({ endpoint: 'sendPoll', method: 'post', params })
  }
  sendChatAction(params) {
    return this.apiCall({ endpoint: 'sendChatAction', method: 'post', params })
  }

  getUserProfilePhotos(params) {
    return this.apiCall({ endpoint: `getUserProfilePhotos?${queryString.stringify(params)}`, method: 'get' })
  }

  editMessageText(params) {
    return this.apiCall({ endpoint: `editMessageText`, method: 'post', params })
  }
}

module.exports = Telegram
