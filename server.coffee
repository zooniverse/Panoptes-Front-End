global.window = require 'window-shim'
global.document = require 'document-shim'
express = require 'express'
React = require 'react'
Router = require '@edpaget/react-router'
routes = require './app/router'

app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'));

app.use (req, res, next) ->
  location = req.url
  router = Router.create {routes, location}
  router.run (Handler, state) ->
    html = React.renderToString(React.createElement Handler, {})
    res.render('index', {html})

port = process.env.PORT || 3735
host = process.env.HOST || '0.0.0.0'

app.listen port, host, ->
  console.log("Zooniverse Front-End listening at http://#{host}:#{port}")
