counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'

module.exports = React.createClass
  displayName: 'AboutSideBar'

  componentDidMount: ->
    # @updateButtonState @props.currentSort

  componentWillReceiveProps: (nextProps) ->
    if nextProps.currentSort isnt @props.currentSort
      @updateButtonState(nextProps.currentSort)

  render: ->
    counterpart.registerTranslations 'en', @props.translations.nav

    <aside className="secondary-page-side-bar">
      <nav ref="sideBarNav">
        {unless @props.subNav is true
          for navItem of @props.sideBarNav
            <button key={navItem} ref={navItem} className="secret-button side-bar-button" onClick={@props.showList.bind(null, navItem)}><Translate content="#{navItem}" /></button>
        else
          for category, subNav of @props.sideBarNav
            i = Math.random()
            <ul key={"#{category}-#{i}"}>
              {for navProp, navItems of subNav
                if navProp is "title"
                  i = Math.random()
                  <button key={i} ref={"#{category}-#{navProp}"} className="secret-button side-bar-button" onClick={@props.showList.bind(null, category)}><Translate content="#{category}.#{navProp}" /></button>
                else
                  if navItems?
                    j = Math.random()
                    <ul key={j}>
                      {for item of navItems
                        <button key={"#{item}"} ref={item} className="secret-button side-bar-button" onClick={@props.showList.bind(null, item)}><Translate content="#{category}.#{navProp}.#{item}" /></button>
                      }
                    </ul>
              }
            </ul>
        }
      </nav>
    </aside>

  updateButtonState: (currentSort) ->
    buttons = React.findDOMNode(@refs.sideBarNav).childNodes
    currentButton = React.findDOMNode(@refs[currentSort])
    for button in buttons
      button.classList.remove 'active'
    currentButton.classList.add 'active'