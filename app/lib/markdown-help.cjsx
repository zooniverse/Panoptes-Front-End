React = require 'react'
alert = require('./alert')

module.exports = ->
  alert <p className="markdown-editor-help">
          <a href="http://markdownlivepreview.com/" target="_blank">Learn more about markdown</a>
        </p>
