const { callbackDataStringify, callbackDataParse } = require('./utils')

const build = Events => {
  const Keyboard = (type = 'inline', buttons, opts) => {
    if (type === 'inline') {
      return { reply_markup: { inline_keyboard: buttons } }
    }

    const options = opts ? opts : { resize_keyboard: true, one_time_keyboard: true }
    return { reply_markup: { keyboard: buttons, ...options } }
  }

  class Buttons {
    withParams(params, callback_id) {
      if (params && typeof params === 'object') {
        return callbackDataStringify(callback_id, params)
      }
      return callback_id
    }

    CallBack(text, callback_id, params, handdler, hide = false) {
      const callback_data = params ? this.withParams(params, callback_id) : callback_id

      if (handdler) {
        if (Events) {
          Events.setCallback_query(callback_data, handdler)
        }
      }
      return {
        text,
        callback_data,
        hide,
      }
    }
    Keyboard(text, opts = null) {
      return {
        text,
        ...opts,
      }
    }
  }

  return {
    Buttons: new Buttons(),
    Keyboard,
  }
}

module.exports = build
