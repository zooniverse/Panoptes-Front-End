generateSessionID = () ->
  sha2 = require('crypto').createHash('sha256')
  id = sha2.update("#{Math.random() * 10000 }#{Date.now()}#{Math.random() * 1000}").digest('hex')
  sessionStorage.setItem('session_id', id)

getSessionID = () ->
  sessionStorage?.getItem('session_id')

module.exports = {generateSessionID, getSessionID}
