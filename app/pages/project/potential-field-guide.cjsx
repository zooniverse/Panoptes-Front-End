React = require 'react'
apiClient = require '../../api/client'
Pullout = require 'react-pullout'
FieldGuide = require '../../components/field-guide'

module.exports = React.createClass
  getDefaultProps: ->
    project: null

  getInitialState: ->
    guide: null
    icons: {}
    revealed: true

  componentDidMount: ->
    @fetchGuide @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @fetchGuide nextProps.project

  fetchGuide: (project) ->
    @setState
      guide: null
      icons: {}
      revealed: false
    apiClient.type('field_guides').get project_id: project.id
      .then ([guide]) =>
        @setState {guide}
        guide.get('attached_images').then (images) =>
          icons = {}
          for image in images
            icons[image.id] = image
          @setState {icons}

  render: ->
    if @state.guide?
      <Pullout className="field-guide-pullout" side="right" open={@state.revealed}>
        <button type="button" className="field-guide-pullout-toggle" onClick={=>
          @setState revealed: not @state.revealed
        }>
          <strong>Field guide</strong>
        </button>
        <header>Field guide</header>
        <FieldGuide items={@state.guide.items} icons={@state.icons} />
      </Pullout>
    else
      null
