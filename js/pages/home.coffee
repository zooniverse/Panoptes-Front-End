React = require 'react'
Translator = require 'react-translator'

{div} = React.DOM

Translator.setStrings
  home:
    title: 'Home'
    intro: 'Welcome to the home page.'

module.exports = React.createClass
  displayName: 'HomePage'

  render: ->
    div className: 'home-page',
      Translator tag: 'h1', 'home.title'
      Translator tag: 'p', 'home.intro'
