React = require 'react'
marked = require 'marked'
emojify = require 'emojify.js'

EMOJI_ROOT = 'http://www.tortue.me/emoji'

module.exports = React.createClass
  displayName: 'Markdown'

  propTypes:
    children: React.PropTypes.string

  replaceEmoji: (match, icon) ->
    "<img class='emoji' src='#{EMOJI_ROOT}/#{icon}.png' alt='#{match}' title='#{match}' />"

  render: ->
    tag = @props.tag ? 'div'

    markedOptions =
      sanitize: true
      breaks: @props.breaks ? true

    className = @props.className ? ''
    markup = marked @props.children ? '', markedOptions
    __html = emojify.replace markup, @replaceEmoji

    React.createElement tag, {className: "markdown #{className}", dangerouslySetInnerHTML: {__html}}
