React = require 'react'
apiClient = require '../../api/client'
Pullout = require 'react-pullout'
SpottersGuide = require '../../components/spotters-guide'

module.exports = React.createClass
  getDefaultProps: ->
    project: null

  getInitialState: ->
    guide: null
    revealed: false

  componentDidMount: ->
    @fetchGuide @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @fetchGuide nextProps.project

  fetchGuide: (project) ->
    @setState
      guide: null
      revealed: false
    apiClient.type('field_guides').get project_id: project.id
      .then ([guide]) =>
        @setState {guide}

  render: ->
    if @state.guide?
      <Pullout className="spotters-guide-pullout" side="right" open={@state.revealed}>
        <button type="button" className="spotters-guide-pullout-toggle" onClick={=>
          @setState revealed: not @state.revealed
        }>
          <strong>Spotter’s guide</strong>
        </button>
        <SpottersGuide items={@state.guide.items} />
      </Pullout>
    else
      null
