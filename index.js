const Telegram = require('./telegram')

const token = '856565326:AAFk5l23CC_OUk3pUOSoGKeUiDj_StpzLjs'
const telegraClient = new Telegram({ token })

telegraClient.lauch()
telegraClient.command('/menu', console.log)