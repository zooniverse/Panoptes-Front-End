React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
CommentBox = require './comment-box'

module.exports = createReactClass
  displayName: 'PrivateMessageForm'

  contextTypes:
    geordi: PropTypes.object
    router: PropTypes.object.isRequired

  logClick: ->
    @context?.geordi?.logEvent
      type: 'send-message'
      data: {sender: @props.user.display_name, recipient: @props.profileUser.display_name}

  onSubmitMessage: (_, body) ->
    @logClick()
    pm = ReactDOM.findDOMNode(@).querySelector('.private-message-form')
    input = pm.querySelector('input')

    title = input.value
    user_id = @props.user.id

    apiClient.type('users').get(login: @props.params.profile_name).index(0)
      .then (user) =>
        recipient_ids = [+user.id] # must be array
        conversation = {title, body, user_id, recipient_ids}

      .then (conversation) =>
        talkClient.type('conversations').create(conversation).save()
          .then (conversation) =>
            @context.router.push "/inbox/#{conversation.id}"

  render: ->
    <div className="talk talk-module">
      {if @props.user
        <div className="private-message-form">
          <input placeholder="Subject" />
          <CommentBox
            header={null}
            user={@props.user}
            content=""
            validationCheck={ -> false }
            validationErrors={[]}
            submitFeedback={"Sent!"}
            onSubmitComment={@onSubmitMessage}
            submit={"Send Message"} />
        </div>}
    </div>
