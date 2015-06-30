React = require 'react'
MarkdownIt = require 'markdown-it'
{State} = require 'react-router'
twemoji = require 'twemoji'

markdownIt = MarkdownIt({linkify: true, breaks: true})
  .use require 'markdown-it-emoji'
  .use require 'markdown-it-sub'
  .use require 'markdown-it-sup'

module?.exports = React.createClass
  displayName: 'TalkCommentPreview'
  mixins: [State]

  propTypes:
    content: React.PropTypes.string
    header: React.PropTypes.string

  getDefaultProps: ->
    header: "Preview"

  replaceSymbols: (string) ->
    {owner, name} = @getParams()
    string
      # subjects in a specific project : owner-slug/project-slug^subject_id
      # \b[\w-]+\b is hyphen boundary for slugs
      .replace(/@(\b[\w-]+\b)\/(\b[\w-]+\b)\^([0-9]+)/g, "<a href='#/projects/$1/$2/talk/subjects/$3'>$1/$2 - Subject $3</a>")

      # user mentions : @username
      .replace(/\B@(\b[\w-]+\b)/g, "<a href='#/users/$1'>@$1</a>")

      # hashtags #tagname
      .replace /\B\#(\w+)/g, (fullTag, tagName) ->
        if owner and name
          "<a href='#/projects/#{owner}/#{name}/talk/search?query=#{tagName}'>#{fullTag}</a>"
        else
          "<a href='#/talk/search?query=#{tagName}'>#{fullTag}</a>"

  markdownify: (input) ->
    markdownIt.render(input)

  emojify: (input) ->
    twemoji.parse(input)

  render: ->
    html = @replaceSymbols(@emojify(@markdownify(@props.content ? '')))

    <div className='talk-comment-preview'>
      <h1>{@props.header}</h1>
      <div className='talk-comment-preview-content' dangerouslySetInnerHTML={__html: html}></div>
    </div>
