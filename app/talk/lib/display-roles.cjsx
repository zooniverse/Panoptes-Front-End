React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
uniqBy = require 'lodash/uniqBy'

zooniverseTeamRole = (role) ->
  role.section is 'zooniverse' and [ 'admin', 'team' ].indexOf(role.name) isnt -1

researcherRole = (role) ->
  userIsResearcher = ['admin', 'scientist', 'owner'].indexOf(role.name) isnt -1
  role.section isnt 'zooniverse' and userIsResearcher

roleDisplayName = (role) ->
  if zooniverseTeamRole(role) # show zooniverse admins everywhere as 'team'
    "Zooniverse Team"
  else if researcherRole(role) # project admins, scientists, owners
    "Researcher"
  else
    role.name

DisplayRoles = createReactClass
  displayName: 'TalkDisplayRoles'

  propTypes:
    roles: PropTypes.array # roles resources

  role: (role, i) ->
    zooTeamName = if zooniverseTeamRole(role) then 'zoo-team'
    <p key={role.id} className="project-role #{zooTeamName ? role.name}">
      {roleDisplayName(role)}
    </p>

  render: ->
    <div className="talk-display-roles">
      {uniqBy(@props.roles, roleDisplayName).map(@role)}
    </div>

module.exports = DisplayRoles
