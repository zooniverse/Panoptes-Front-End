React = require 'react'
HomePageLoggedIn = require './home-logged-in'
HomePageNotLoggedIn = require './home-not-logged-in'

module.exports = React.createClass
  displayName: 'HomePageRoot'

  render: ->
    if @props.user
      <HomePageLoggedIn {...@props} />
    else
      <HomePageNotLoggedIn {...@props} />