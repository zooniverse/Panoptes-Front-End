React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
talkClient = require 'panoptes-client/lib/talk-client'
userIsModerator = require './user-is-moderator'

module?.exports = React.createClass
  displayName: 'Moderation'

  propTypes:
    section: React.PropTypes.string.isRequired # talk section
    user: React.PropTypes.object.isRequired

  render: ->
    {section, user} = @props
    <PromiseRenderer pending={null} promise={talkClient.type('roles').get(user_id: user.id, section: ['zooniverse', section], page_size: 100)}>{(roles) =>
      if userIsModerator(user, roles, section)
        @props.children
      else
         null
    }</PromiseRenderer>
