React = require 'react'
`import HomePageLoggedIn from './home-for-user';`
`import HomePageNotLoggedIn from './home-not-logged-in';`

module.exports = React.createClass
  displayName: 'HomePageRoot'

  render: ->
    if @props.user
      <HomePageLoggedIn {...@props} />
    else
      <HomePageNotLoggedIn {...@props} />
