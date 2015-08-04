React = require 'react'
{Markdown} = require 'markdownz'

module?.exports = React.createClass
  displayName: 'TalkCommentPreview'

  propTypes:
    content: React.PropTypes.string
    header: React.PropTypes.string

  getDefaultProps: ->
    header: "Preview"

  render: ->
    <div className='talk-comment-preview'>
      <h1>{@props.header}</h1>
      <Markdown className='talk-comment-preview-content' content={@props.content} />
    </div>
