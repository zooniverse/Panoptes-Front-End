React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
userIsZooniverseAdmin = require './user-is-zooniverse-admin'

module.exports = React.createClass
  displayName: 'ZooniverseTeam'

  propTypes:
    section: React.PropTypes.string.isRequired # talk section
    user: React.PropTypes.object.isRequired

  getInitialState: ->
    open: false
    roles: []

  componentDidMount: ->
    @updateRoles @props.user

  componentWillReceiveProps: (newProps) ->
    @updateRoles newProps.user if newProps.user isnt @props.user

  updateRoles: (user) ->
    talkClient.type 'roles'
      .get
        user_id: user.id
        section: ['zooniverse', @props.section]
        page_size: 100
      .then (roles) =>
        @setState {roles}

  render: ->
    {section} = @props

    <div>
      {if userIsZooniverseAdmin(@state.roles)
        @props.children
      else
        null
      }
    </div>
