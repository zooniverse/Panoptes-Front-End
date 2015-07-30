React = require 'react'
MarkdownIt = require 'markdown-it'
MarkdownItContainer = require 'markdown-it-container'
twemoji = require 'twemoji'
{State} = require 'react-router'

markdownIt = new MarkdownIt
  linkify: true
  breaks: true

markdownIt
  .use require 'markdown-it-emoji'
  .use require 'markdown-it-sub'
  .use require 'markdown-it-sup'
  .use require 'markdown-it-footnote'
  .use MarkdownItContainer, 'partners'
  .use MarkdownItContainer, 'attribution'

module.exports = React.createClass
  displayName: 'Markdown'

  mixins: [State]

  getDefaultProps: ->
    tag: 'div'
    content: ''
    inline: false

  replaceSymbols: (input) ->
    # Catch getParams in case we're in a non-routed context like an alert
    {owner, name} = try @getParams() catch _ then [null, null]

    input
      # subjects in a specific project : owner-slug/project-slug^subject_id
      # \b[\w-]+\b is hyphen boundary for slugs
      .replace /@(\b[\w-]+\b)\/(\b[\w-]+\b)\^([0-9]+)/g, "<a href='#/projects/$1/$2/talk/subjects/$3'>$1/$2 - Subject $3</a>"

      .replace(/\^([0-9]+)/g, (_, subjectID) ->
        if owner and name
          "<a href='#/projects/#{owner}/#{name}/talk/subjects/#{subjectID}'>#{owner}/#{name} - Subject #{subjectID}</a>"
        else
          subjectID)

     # user mentions : @username
      .replace /\B@(\b[\w-]+\b)/g, "<a href='#/users/$1'>@$1</a>"

      # hashtags #tagname
      .replace /(?!\B.*\/)\B#(\b[\w+-\/]+\b)/g, (fullTag, tagName) ->
        if owner and name
          "<a href='#/projects/#{owner}/#{name}/talk/search?query=#{tagName}'>#{fullTag}</a>"
        else
          "<a href='#/talk/search?query=#{tagName}'>#{fullTag}</a>"

  emojify: (input) ->
    twemoji.parse input

  markdownify: (input) ->
    if @props.inline
      markdownIt.renderInline input
    else
      markdownIt.render input

  render: ->
    html = @replaceSymbols(@emojify(@markdownify(@props.children ? @props.content)))

    React.createElement @props.tag,
      className: "markdown #{@props.className ? ''}"
      dangerouslySetInnerHTML: __html: html
