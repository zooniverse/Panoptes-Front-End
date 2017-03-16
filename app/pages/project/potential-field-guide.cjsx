React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
Pullout = require 'react-pullout'
FieldGuide = require '../../components/field-guide'

module.exports = React.createClass
  displayName: 'PotentialFieldGuide'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    guide: null
    icons: {}
    revealed: true

  contextTypes:
    geordi: React.PropTypes.object

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
    apiClient.type('field_guides').get(project_id: project.id, include: ['attached_images']) 
      .then ([guide]) =>
        @setState {guide}
        apiClient.type('media').get(guide.links.attached_images.ids).then (images) => 
          icons = {}
          for image in images
            icons[image.id] = image
          @setState {icons}

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
    if @state.guide? and @state.guide.items.length isnt 0
      <Pullout className="field-guide-pullout" side="right" open={@state.revealed}>
        <button type="button" className="field-guide-pullout-toggle" onClick={@toggleFieldGuide}>
          <strong>Field guide</strong>
        </button>
        <FieldGuide items={@state.guide.items} icons={@state.icons} onClickClose={@toggleFieldGuide} />
      </Pullout>
    else
      null
