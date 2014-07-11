if process.env.NODE_ENV is 'offline'
  offlineData = require './offline-data'

  delay = (fn) ->
    pause = 500
    pause += Math.random() * 2000
    setTimeout fn, pause

request =
  headers: {}

  get: (path, [params]..., callback) ->
    new Promise (resolve, reject) ->
      if process.env.NODE_ENV is 'offline'
        console?.info 'Would GET', path, JSON.stringify params
        delay ->
          response = offlineData[path]
          if response?
            resolve response
            callback? null, response
          else
            error = new Error 404
            reject error
            callback? error

  post: (path, data, callback) ->
    new Promise (resolve, reject) ->
      if process.env.NODE_ENV is 'offline'
        console?.info 'Would POST', path, JSON.stringify data
        delay ->
          offlineData[path] = data
          resolve()
          callback?()

  patch: (path, data, callback) ->
    new Promise (resolve, reject) ->
      if process.env.NODE_ENV is 'offline'
        console?.info 'Would PATCH', path, JSON.stringify data
        delay ->
          if offlineData[path]?
            for key, value of data
              offlineData[path][key] = value
            resolve offlineData[path]
            callback? null, offlineData[path]
          else
            error = new Error 404
            reject error
            callback? error

  delete: (path, callback) ->
    new Promise (resolve, reject) ->
      console?.info 'Would DELETE', path
      delay ->
        if delete offlineData[path]
          resolve()
          callback?()
        else
          error = new Error 404
          reject error
          callback? error

module.exports = request
