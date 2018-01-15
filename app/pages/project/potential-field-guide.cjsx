React = require 'react'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
Pullout = require 'react-pullout'
FieldGuide = require './field-guide'
Translations = require('../../classifier/translations').default

module.exports = createReactClass
  displayName: 'PotentialFieldGuide'

  getDefaultProps: ->
    project: null
    guide: null
    guideIcons: null

  getInitialState: ->
    revealed: false

  contextTypes:
    geordi: React.PropTypes.object
    store: React.PropTypes.object

  logClick: (type) ->
    @context?.geordi?.logEvent
      type: type

  toggleFieldGuide: ->
    if @state.revealed
      type = "close-field-guide"
    else
      type = "open-field-guide"
    @logClick type
    @setState revealed: not @state.revealed

  render: ->
    if @props.guide? and @props.guide.items.length isnt 0 and @props.guideIcons?
      <Pullout className="field-guide-pullout" side="right" open={@state.revealed}>
        <button type="button" className="field-guide-pullout-toggle" onClick={@toggleFieldGuide}>
          <strong>Field guide</strong>
        </button>
        <Translations original={@props.guide} type="field_guide" store={@context.store}>
          <FieldGuide items={@props.guide.items} icons={@props.guideIcons} onClickClose={@toggleFieldGuide} />
        </Translations>
      </Pullout>
    else
      null
