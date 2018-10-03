storage = window.sessionStorage ? window.localStorage
stored = JSON.parse storage?.getItem('session_id')

generateSessionID = () ->
  hash = require('hash.js')
  sha2 = hash.sha256()
  id = sha2.update("#{Math.random() * 10000 }#{Date.now()}#{Math.random() * 1000}").digest('hex')
  ttl = fiveMinutesFromNow()
  stored = {id, ttl}
  try
    storage.setItem('session_id', JSON.stringify(stored))
  stored

getSessionID = () ->
  {id, ttl} = JSON.parse(storage.getItem('session_id')) ? generateSessionID()
  if ttl < Date.now()
    {id} = generateSessionID()
  else
    ttl = fiveMinutesFromNow()
    try
      storage.setItem('session_id', JSON.stringify({id, ttl}))
  id

fiveMinutesFromNow = () ->
  d = new Date()
  d.setMinutes(d.getMinutes() + 5)
  d

module.exports = {generateSessionID, getSessionID}
