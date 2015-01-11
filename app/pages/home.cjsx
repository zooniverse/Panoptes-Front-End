counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'

counterpart.registerTranslations 'en',
  home:
    title: 'Home'
    intro: 'Welcome to the home page.'

module.exports = React.createClass
  displayName: 'HomePage'

  render: ->
    <div className="home-page content-container">
      <Translate component="h1" content="home.title" />
      <Translate component="p" content="home.intro" />
    </div>
