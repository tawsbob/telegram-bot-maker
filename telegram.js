const queryString = require('query-string')
const client = require('./axio-client')
const autoBind = require('auto-bind')

class Buttons {
  constructor(bot){
      this.bot = bot
  }
  CallBack(text, callback_data, handdler, hide = false){
    if(handdler){
      this.bot.setCallback_query(callback_data, handdler)
    }
    return {
      text,
      callback_data,
      hide
    }
  }
  Keyboard(text, opts = null){
    return {
      text,
      ...opts
    }
  }
}

const Keyboard = (type='inline', buttons, opts)=>{
  if(type==='inline'){
    return { reply_markup: { inline_keyboard: [buttons] } }
  }

  const options = opts ? opts : {resize_keyboard: true, one_time_keyboard: true}
  return { reply_markup: { keyboard: [buttons],  ...options } }
}


class Telegram {
  constructor({ token }) {
    this.baseUrl = 'https://api.telegram.org/'
    this.baseBotUrl = `${this.baseUrl}bot${token}/`
    autoBind(this)
  }

  async apiCall({ method, params, endpoint }) {
    try {
      const url = this.baseBotUrl + endpoint
      const response = await client[method](url, params)

      console.log(url)

      if (response && response.data && response.data.result) {
        return response.data.result
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
}

class Context extends Telegram {
  constructor(props){
    super(props)
    this.update = props.update
  }

  contextParams(params){
    return {
      chat_id: this.update.message.chat.id,
      ...params
    }
  }

  reply(text, params){

    this.sendMessage(
      this.contextParams({ text, ...params })
    )
  }

}

class Bot extends Telegram {
  constructor(props) {
    super(props)
    const { token, polling = true } = props

    this.polling = polling
    this.pollingTimeout = null
    this.updateInterval = 1250
    this.started = false

    this.listeners = {
      message: null,
      command: [],
      callback_query: []
    }

    this.props = props
    this.offset = 0

    this.Buttons = new Buttons(this)
    this.Keyboard = Keyboard
  }



  lauch() {
    this.started = true
    this.updateTrigger()
  }

  updateTrigger(){
    this.pollingTimeout = setTimeout(this.lookingForUpdates, this.updateInterval)
  }

  async lookingForUpdates() {

    if(!this.started){
      return
    }

    try {
      const { offset } = this

      const updates = await this.getUpdate({ offset, limit: 20 })

      if(updates){
        this.check(updates)
      }

      if(updates && updates.length){
        //https://core.telegram.org/bots/api#getting-updates
        //Must be greater by one than the highest among the identifiers of previously received updates
        this.offset = updates[
          updates.length-1
        ].update_id + 1
      }

      this.updateTrigger()

    } catch (e) {
      console.warn(e)
    }
  }

  check(updates) {
    const length = updates.length
    for (let i = 0; i < length; i++) {
      this.checkUpdate(updates[i])
    }
  }

  checkUpdate(update) {

    console.log(
      JSON.stringify(
        update
      )
    )

    if(update.callback_query){
        const { data } = update.callback_query
          this.triggerCallBackQueryListeners(data,update)
    }

    if(update.message){

      const { message }         = update
      const { text, entities }  = message
      const isCommand           = this.checkEntities(entities, text)

      if (!isCommand) {
        this.triggerMsgListener(update)
      }
    }

  }

  checkEntities(entities, text) {
    let isCommand = false
    if (entities && entities.length) {
      const length = entities.length
      for (let i = 0; i < length; i++) {
        if (entities[i].type === 'bot_command') {
          this.emit(entities[i].type, text)
          isCommand = true
        }
      }
    }

    return isCommand
  }

  stop() {
    this.started = false
    clearTimeout(this.pollingTimeout)
  }

  triggerCallBackQueryListeners(data, update){
    const length = this.listeners.callback_query.length
    for (let i = 0; i < length; i++) {
      if (this.listeners.callback_query[i].data === data) {
        this.listeners.callback_query[i].handdler(
          update.callback_query,
          new Context({ ...this.props, update })
        )
      }
    }
  }

  triggerMsgListener(update){
    if (this.listeners.message) {
      const { message } = update
      this.listeners.message(
        message,
        new Context({ ...this.props, update })
      )
    }
  }

  emit(type, command) {
    const length = this.listeners.command.length
    for (let i = 0; i < length; i++) {
      if (this.listeners.command[i].type === type && this.listeners.command[i].command === command) {
        this.listeners.command[i].handdler(command)
      }
    }
  }

  command(command, handdler) {
    this.listeners.command.push({ type: 'bot_command', command, handdler })
  }

  setCallback_query(data, handdler){
    this.listeners.callback_query.push({ data, handdler })
  }

  on(listener, handdler) {
    if (this.listeners[listener] !== 'undefined') {
      this.listeners[listener] = handdler
    }
  }
}

module.exports = {
  Bot,
  Keyboard,
  Buttons
}
