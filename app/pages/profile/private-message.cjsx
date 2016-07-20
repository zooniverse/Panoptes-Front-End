React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
talkClient = require 'panoptes-client/lib/talk-client'

module.exports = React.createClass
  displayName: 'PrivateMessagePage'

  getInitialState: ->
    block: null

  componentDidMount: ->
    if @props.project?
      document.documentElement.classList.add 'on-secondary-page'
    userId = @props.profileUser?.id
    @getBlockedUser(userId) if userId

  componentWillReceiveProps: (nextProps) ->
    userId = nextProps.profileUser?.id
    @getBlockedUser(userId) if userId and userId isnt @props.profileUser?.id

  componentWillUnmount: ->
    if @props.project?
      document.documentElement.classList.remove 'on-secondary-page'

  getBlockedUser: (id) ->
    talkClient.type('blocked_users').get(blocked_user_id: id).then ([block]) =>
      @setState {block}

  handleBlock: (e) ->
    talkClient.type('blocked_users').create(blocked_user_id: @props.profileUser.id).save().then (block) =>
      @setState {block}

  handleUnblock: (e) ->
    @state.block.delete().then =>
      @setState block: null

  render: ->
    {block} = @state
    <div className="private-message-page">
      {if @props.user?
        <div className="content-container">
          {if block
            <div className="block-user">
              <button className="block-button" onClick={@handleUnblock}>Unblock</button>
              <p className="description">You have blocked this user</p>
            </div>
          else
            <div>
              <h2>
                Send a private message to {@props.profileUser.display_name}
                {' '}
                {if @props.user is @props.profileUser
                  <span>
                    <br />
                    <small className="form-help">(Hey wait, that’s you!)</small>
                  </span>}
              </h2>

              <PrivateMessageForm {...@props} />

              <div className="block-user">
                <button className="block-button" onClick={@handleBlock}>Block</button>
                <p className="description">You can prevent this user from sending you messages</p>
              </div>
            </div>}
        </div>
      else
        <p>Sign in to send this user a message.</p>}
    </div>
