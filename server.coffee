global.window = require 'window-shim'
global.document = require 'document-shim'
express = require 'express'
React = require 'react'
{match, RoutingContext} = require 'react-router'
{renderToString} = require 'react-dom/server'
routes = require './app/router'

app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use (req, res, next) ->
  location = req.url

  match {routes, location}, (error, redirectLocation, renderProps) ->
    html = renderToString(React.createElement RoutingContext, renderProps)
    res.render('index', {html})

port = process.env.PORT || 3735
host = process.env.HOST || '0.0.0.0'

app.listen port, host, ->
  console.log("Zooniverse Front-End listening at http://#{host}:#{port}")
