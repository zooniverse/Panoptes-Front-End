counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
isAdmin = require '../lib/is-admin'
TriggeredModalForm = require 'modal-form/triggered'
loadLanguage = require '../lib/load-language'

module.exports = React.createClass
  displayName: 'LanguageSelector'

  render: ->
    if @props.user?.admin
      return <TriggeredModalForm triggerProps={title: "Language Selection"} trigger={<span className="main-nav-item"><i style={verticalAlign: 'middle'} className="fa fa-globe" /></span>}>
        <div className="modal-nav-links">
          <a onClick={@englishMode} className="main-nav-item" target="_blank">English</a>
          <a onClick={@pirateMode} className="main-nav-item" target="_blank">Pirate Mode</a>
        </div>
      </TriggeredModalForm>
    else
      return null

  englishMode: ->
    loadLanguage('en', @props.user)

  pirateMode: ->
    loadLanguage('pr', @props.user)

