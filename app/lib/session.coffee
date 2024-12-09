storage = window.sessionStorage
stored = JSON.parse storage?.getItem('session_id')

generateSessionID = () ->
  hash = require('hash.js')
  sha2 = hash.sha256()
  id = sha2.update("#{Math.random() * 10000 }#{Date.now()}#{Math.random() * 1000}").digest('hex')
  stored = {id}
  try
    storage.setItem('session_id', JSON.stringify(stored))
  stored

getSessionID = () ->
  {id} = JSON.parse(storage.getItem('session_id')) ? generateSessionID()
  id

module.exports = {generateSessionID, getSessionID}
