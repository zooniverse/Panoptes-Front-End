React = require 'react'
uniq = require 'lodash.uniq'

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

DisplayRoles = React.createClass
  displayName: 'TalkDisplayRoles'

  propTypes:
    roles: React.PropTypes.array # roles resources

  role: (role, i) ->
    zooTeamName = if zooniverseTeamRole(role) then 'zoo-team'
    <p key={role.id} className="project-role #{zooTeamName ? role.name}">
      {roleDisplayName(role)}
    </p>

  render: ->
    <div className="talk-display-roles">
      {uniq(@props.roles, roleDisplayName).map(@role)}
    </div>

module?.exports = DisplayRoles
