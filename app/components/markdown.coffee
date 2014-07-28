React = require 'react'
marked = require 'marked'

module.exports = React.createClass
  displayName: 'Markdown'

  propTypes:
    children: React.PropTypes.string

  render: ->
    tag = React.DOM[@props.tag] ? React.DOM.div

    markedOptions =
      sanitize: true
      breaks: @props.breaks ? true

    __html = marked @props.children, markedOptions

    @transferPropsTo tag dangerouslySetInnerHTML: {__html}
