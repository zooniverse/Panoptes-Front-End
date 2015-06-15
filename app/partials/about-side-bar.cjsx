counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'

module.exports = React.createClass
  displayName: 'AboutSideBar'

  componentDidMount: ->
    @updateButtonState @props.currentSort

  componentWillReceiveProps: (nextProps) ->
    if nextProps.currentSort isnt @props.currentSort
      @updateButtonState(nextProps.currentSort)

  render: ->
    counterpart.registerTranslations 'en', @props.translations.nav

    <aside className="secondary-page-side-bar">
      <nav ref="sideBarNav">
        {for navItem of @props.sideBarNav
          <button key={navItem} ref={navItem} className="secret-button side-bar-button" onClick={@props.showList.bind(null, navItem)}><Translate content="#{navItem}" /></button>
        }
      </nav>
    </aside>

  updateButtonState: (currentSort) ->
    buttons = React.findDOMNode(@refs.sideBarNav).childNodes
    currentButton = React.findDOMNode(@refs[currentSort])
    for button in buttons
      button.classList.remove 'active'
    currentButton.classList.add 'active'