React = require 'react'
MarkdownIt = require 'markdown-it'

markdownIt = MarkdownIt()
  .use require 'markdown-it-emoji'
  .use require 'markdown-it-sub'
  .use require 'markdown-it-sup'

module?.exports = React.createClass
  displayName: 'TalkCommentPreview'

  propTypes:
    content: React.PropTypes.string
    header: React.PropTypes.string

  getDefaultProps: ->
    header: "Preview"

  replaceSymbols: (string) ->
    string
      .replace(/@(\w+)/g, "<a href='#/users/$1'>$1</a>") # user mentions
      .replace(/\^([A-Za-z]+[0-9]+)/g, "<a href='http://www.zooniverse.org/subjects/$1'>$1</a>") # subject mentions
      .replace(/\#(\w+)/g, "<a href='http://www.zooniverse.org/tags/$1'>#$1</a>") # hashtags

  markdownify: (input) ->
    markdownIt.render(input)

  render: ->
    html = @replaceSymbols(@markdownify(@props.content ? ''))

    <div className='talk-comment-preview'>
      <h1>{@props.header}</h1>
      <div className='talk-comment-preview-content' dangerouslySetInnerHTML={__html: html}></div>
    </div>
