const callbackDataStringify = (callback_id, params) => `${callback_id}>${JSON.stringify(params)}`

const callbackDataParse = callback_data => {
  const withParams = callback_data.split('>')
  let params = null

  if (withParams.length > 1) {
    params = JSON.parse(withParams[1])
    return { callback_data: withParams[0], params }
  }

  return { callback_data, params }
}

const Keyboard = (type = 'inline', buttons, opts) => {
    if (type === 'inline') {
      return { reply_markup: { inline_keyboard: [buttons] } }
    }
  
    const options = opts ? opts : { resize_keyboard: true, one_time_keyboard: true }
    return { reply_markup: { keyboard: [buttons], ...options } }
  }

module.exports = {
    callbackDataStringify,
    callbackDataParse,
    Keyboard
}