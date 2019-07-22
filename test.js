require('./src/events')
const UpdateHandler = require('./src/update-handler')

const token = '856565326:AAFk5l23CC_OUk3pUOSoGKeUiDj_StpzLjs'
const UpdateService = new UpdateHandler({ token })

UpdateService.lauch()
