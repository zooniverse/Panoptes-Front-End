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
    tag = React.DOM[@props.tag] ? React.DOM.div

    markedOptions =
      sanitize: true
      breaks: @props.breaks ? true

    markup = marked @props.children ? '', markedOptions
    __html = emojify.replace markup, @replaceEmoji

    @transferPropsTo tag className: 'markdown', dangerouslySetInnerHTML: {__html}
