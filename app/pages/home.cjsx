React = require 'react'
HomePageLoggedIn = require('./home-for-user').default
HomePageNotLoggedIn = require './home-not-logged-in'

module.exports = React.createClass
  displayName: 'HomePageRoot'

  render: ->
    if @props.user
      <HomePageLoggedIn {...@props} />
    else
      <HomePageNotLoggedIn {...@props} />
