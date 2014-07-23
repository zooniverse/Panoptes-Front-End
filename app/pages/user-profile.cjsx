# @cjsx React.DOM

React = require 'react'

getUser = (login, callback) ->
  setTimeout ->
    callback null,
      login: 'brian-c'
      display_name: 'brian-c'
      avatar: 'https://pbs.twimg.com/profile_images/420634335964692480/aXU3vnUq.jpeg'
      credited_name: 'Brian Carstensen'
      location: 'Chicago, IL'
      twitter: '__brian_c__'
      website: 'https://github.com/brian-c'
      bio: '''
        Web developer at the Zooniverse!
      '''
      projects: []
      recents: []
      collections: []
      messages: []

OwnerHeader = React.createClass
  displayName: 'UserHeader'

  render: ->
    <div className="owner-header content-container columns-container">
      <div>
        <img src={@props.user.avatar} className="avatar"/>
      </div>
      <div>
        <span className="credited-name">{@props.user.credited_name || @props.user.display_name}</span>
        {if @props.user.credited_name
          <span className="display-name">&emsp;({@props.user.display_name})</span>}
        {if @props.user.location
          <div className="location">{@props.user.location}</div>}
        <hr />
        <div className="external-links">
          {if @props.user.website
            <div><i>[w]</i> <a href={@props.user.website}>{@props.user.website}</a></div>}
          {if @props.user.twitter
            <div><i>[t]</i> @<a href="https://twitter.com/#{@props.user.twitter}">{@props.user.twitter}</a></div>}
        </div>
      </div>
    </div>

module.exports = React.createClass
  displayName: 'UserPage'

  componentWillMount: ->
    console.log 'MOUNTING WITH', @state.params.login
    getUser @state.params.login, (error, user) =>
      @setState {user}

  render: ->
    if @state?.user?
      <div className="user-page">
        <OwnerHeader className="content-container" user={@state.user} />

        <div className="tabbed-content" data-side="top">
          <div className="tabbed-content-tabs">
            <a href="#" className="tabbed-content-tab selected">Bio</a>
            <a href="#" className="tabbed-content-tab">Recents</a>
            <a href="#" className="tabbed-content-tab">Collections</a>
            <a href="#" className="tabbed-content-tab">Talk</a>
          </div>
          <div className="content-container">
            <p>TODO: Put some content here.</p>
          </div>
        </div>
      </div>

    else
      <div className="loading">Loading...</div>
