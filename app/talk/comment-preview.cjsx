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
      # subjects scoped to a specific project : owner-slug/project-slug^subject_id
      # \b[\w-]+\b is hyphen boundary for slugs
      .replace(/@(\b[\w-]+\b)\/(\b[\w-]+\b)\^([0-9]+)/g, "<a href='#/projects/$1/$2/talk/subjects/$3'>$1/$2 - Subject $3</a>")

      # user mentions : @username
      .replace(/@(\b[\w-]+\b)/g, "<a href='#/users/$1'>$1</a>")

      # subject mentions : ^subject_id
      .replace(/\^([0-9]+)/g, "<a href='#/subjects/$1'>Subject $1</a>")

      # hashtags #tagname
      .replace(/\#(\w+)/g, "<a href='#/talk/search?query=$1'>#$1</a>")

  markdownify: (input) ->
    markdownIt.render(input)

  render: ->
    html = @replaceSymbols(@markdownify(@props.content ? ''))

    <div className='talk-comment-preview'>
      <h1>{@props.header}</h1>
      <div className='talk-comment-preview-content' dangerouslySetInnerHTML={__html: html}></div>
    </div>
