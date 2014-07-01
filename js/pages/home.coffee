React = require 'react'
Translator = require 'react-translator'
{TabContainer, Tab} = require '../components/tab-container'

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

      TabContainer null,
        Tab null, 'EN'
        div null, 'Hello world'

        Tab null, 'ES'
        div null, 'Hold mundo'
