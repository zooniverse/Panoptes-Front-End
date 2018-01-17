React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
  displayName: 'CommentContextIcon'

  getInitialState: ->
    status = if @props.comment.board_permissions.read isnt 'all'
      'private'
    else if @props.comment.discussion_locked
      'locked'

    {status}

  title: ->
    switch @state.status
      when 'locked'  then 'This comment is in a locked discussion'
      when 'private' then 'This comment is in a private board'
      else ''

  icon: ->
    switch @state.status
      when 'locked'  then 'lock'
      when 'private' then 'eye-slash'
      else ''

  render: ->
    return <span></span> unless @state.status
    <i className={"talk-comment-context-icon fa fa-#{@icon()}"} title={@title()}/>
