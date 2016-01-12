stored = sessionStorage?.getItem('session_id')

generateSessionID = () ->
  sha2 = require('crypto').createHash('sha256')
  id = sha2.update("#{Math.random() * 10000 }#{Date.now()}#{Math.random() * 1000}").digest('hex')
  ttl = fiveMinutesFromNow()
  stored = {id, ttl}
  try
    sessionStorage.setItem('session_id', JSON.stringify(stored))
  stored

getSessionID = () ->
  {id, ttl} = JSON.parse(sessionStorage.getItem('session_id')) ? stored
  if ttl < Date.now()
    {id} = generateSessionID()
  else
    ttl = fiveMinutesFromNow()
    try
      sessionStorage.setItem('session_id', JSON.stringify({id, ttl}))
  id

fiveMinutesFromNow = () ->
  d = new Date()
  d.setMinutes(d.getMinutes() + 5)
  d

module.exports = {generateSessionID, getSessionID}
