const request = require('request')
const fs = require('fs')

const defaults = {
  timeout: 20000,
  json: true,
}

const buildOptions = opts => {
  const { file, ...rest } = opts

  //melhorar isso aqui
  if (file) {
    const { filename, filePath, type, contentType } = file
    const { method, url, body, ...aditional } = rest
    const formData = {
      [type]: fs.createReadStream(filePath),
      ...body,
    }

    return { method, url, ...aditional, ...defaults, formData }
  }

  return { ...opts, ...defaults }
}

const client = opts => {
  return new Promise((resolve, reject) => {
    const requestParams = buildOptions(opts)

    request(requestParams, (err, httpResponse, body) => {
      if (err) {
        reject(err)
      } else {
        resolve([httpResponse, body])
      }
    })
  })
}

module.exports = client
