counterpart = require 'counterpart'
React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
PromiseRenderer = require '../../components/promise-renderer'
authClient = require '../../api/auth'
{Navigation} = require 'react-router'


module.exports = React.createClass
  displayName: 'PrivateMessagePage'
  mixins: [Navigation]

  render: ->
    <PromiseRenderer promise={authClient.checkCurrent()} pending={null}>{(user) =>
      if user?
        if user?.login isnt @props.params?.name
          <PrivateMessageForm {...@props} />
        else
          @redirectToMessages()
      else
        @redirectToCollections()
    }</PromiseRenderer>

  redirectToMessages: ->
    @transitionTo 'inbox'

  redirectToCollections: ->
    @transitionTo 'collections-user', owner: @props.params?.name

