React = require 'react'
ChangeListener = require '../../components/change-listener'
PromiseRenderer = require '../../components/promise-renderer'
authClient = require '../../api/auth'
talkClient = require '../../api/talk'

intersect = (arr1, arr2) ->
  arr1.filter (n) -> arr2.indexOf(n) isnt -1

userIsZooniverseAdmin = (usersRoles) ->
  zooniverseAdminRoles = usersRoles.filter (role) ->
    role.section is 'zooniverse' and role.name is 'admin'
  zooniverseAdminRoles.length > 0

userIsModerator = (user, roles, section) -> # User response, Roles Response, Talk Section
  return true if userIsZooniverseAdmin(roles)

  allowedModerationRoles = ['admin', 'moderator']

  moderationRoles = roles
    .filter (role) -> role.section is section
    .map (role) -> role.name

  intersect(moderationRoles, allowedModerationRoles).length > 0

module?.exports = React.createClass
  displayName: 'Moderation'

  getInitialState: ->
    open: false

  propTypes:
    section: React.PropTypes.string.isRequired # talk section

  toggleModeration: (e) ->
    @setState open: !@state.open

  render: ->
    {section} = @props

    <ChangeListener target={authClient}>{=>
      <PromiseRenderer pending={null} promise={authClient.checkCurrent()}>{(user) =>
        if user?
          <PromiseRenderer pending={null} promise={talkClient.type('roles').get(user_id: user.id)}>{(roles) =>
            if userIsModerator(user, roles, section)
              <div className="talk-moderation">
                <button onClick={@toggleModeration}>
                  <i className="fa fa-#{if @state.open then 'close' else 'warning'}" /> Moderator Controls
                </button>
                <div className="talk-moderation-children">
                  {
                    if @state.open
                      @props.children
                    else
                      null
                  }
                </div>
              </div>
          }</PromiseRenderer>
      }</PromiseRenderer>
    }</ChangeListener>
