React = require 'react'
createReactClass = require 'create-react-class'

tagsToIgnore = ['a', 'button', 'input', 'label']
SELECTOR_TO_IGNORE = ([tag, "#{tag} *"].join ',' for tag in tagsToIgnore).join ','

ENTER_KEY = 13
SPACE_KEY = 32

module.exports = createReactClass
  displayName: 'Details'

  getDefaultProps: ->
    summary: '···'
    defaultOpen: false

  getInitialState: ->
    open: @props.defaultOpen

  render: ->
    <div {...@props} className="details-container #{@props.classname}" data-is-open={@state.open || null}>
      <div ref="summary" className="details-summary" tabIndex="0" onClick={@handleSummaryClick} onKeyPress={@handleSummaryKeyPress}>{@props.summary}</div>
      {if @state.open
        @props.children}
    </div>

  handleSummaryClick: (e) ->
    unless e.target.matches SELECTOR_TO_IGNORE
      @toggle()

  handleSummaryKeyPress: (e) ->
    if document.activeElement is @refs.summary
      if e.which in [ENTER_KEY, SPACE_KEY]
        e.preventDefault()
        @toggle()

  toggle: ->
    @setState open: not @state.open
