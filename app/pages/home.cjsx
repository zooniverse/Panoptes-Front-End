# @cjsx React.DOM

React = require 'react'
Translator = require 'react-translator'

Translator.setStrings
  home:
    title: 'Home'
    intro: 'Welcome to the home page.'

module.exports = React.createClass
  displayName: 'HomePage'

  render: ->
    <div className="home-page content-container">
      <Translator tag="h1">home.title</Translator>
      <Translator tag="p">home.intro</Translator>
    </div>
