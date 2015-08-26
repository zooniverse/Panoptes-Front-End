generateSessionID = () ->
  sha2 = require('crypto').createHash('sha256')
  id = sha2.update("#{Math.random() * 10000 }#{Date.now()}#{Math.random() * 1000}").digest('hex')
  ttl = tenMinutesFromNow()
  stored = {id, ttl}
  sessionStorage.setItem('session_id', JSON.stringify(stored))
  stored

getSessionID = () ->
  {id, ttl} = JSON.parse(sessionStorage?.getItem('session_id'))
  if ttl < Date.now()
    {id} = generateSessionID()
  else
    ttl = tenMinutesFromNow()
    sessionStorage.setItem('session_id', JSON.stringify({id, ttl}))
  id

tenMinutesFromNow = () ->
  d = new Date()
  d.setMinutes(d.getMinutes() + 5)
  d

module.exports = {generateSessionID, getSessionID}
