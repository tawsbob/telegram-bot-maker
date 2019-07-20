const got = require('got')
const FormData = require('form-data')
const fs = require('fs')

const defaults = {
  timeout: 20000,
  json: true,
}

//arranjar um jeito de melhorar esses spreads
const buildOptions = opts => {
  const { file, ...rest } = opts

  if (file) {
    const { filePath, type, url } = file

    if (filePath) {
      const { method, url, body, ...aditional } = rest
      const form = new FormData()
      Object.keys(body).forEach(att => {
        form.append(att, body[att])
      })
      form.append(type, fs.createReadStream(filePath))

      return { method, url, ...aditional, ...defaults, body: form, json: undefined }
    }

    if (url) {
      const { method, url, body, ...aditional } = rest
      const _body = {
        [type]: url,
        ...body,
      }
      return { method, url, ...aditional, ...defaults, body: _body }
    }
  }

  return { ...opts, ...defaults }
}

const client = opts => {
  const requestParams = buildOptions(opts)
  return got(requestParams)
}

module.exports = client
