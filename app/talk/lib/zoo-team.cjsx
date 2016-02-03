React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
talkClient = require 'panoptes-client/lib/talk-client'
userIsZooniverseAdmin = require './user-is-zooniverse-admin'

module?.exports = React.createClass
  displayName: 'ZooniverseTeam'

  propTypes:
    section: React.PropTypes.string.isRequired # talk section
    user: React.PropTypes.object.isRequired

  getInitialState: ->
    open: false

  render: ->
    {section} = @props

    <div>
      <PromiseRenderer pending={null} promise={talkClient.type('roles').get(user_id: @props.user.id, section: ['zooniverse', section], page_size: 100)}>{(roles) =>

        if userIsZooniverseAdmin(roles)
          @props.children
        else
          null

      }</PromiseRenderer>
    </div>
