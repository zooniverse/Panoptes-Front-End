React = require 'react'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
moment = require 'moment'

module.exports = createReactClass
  displayName: 'DataExportButton'
  
  componentWillMount: ->
    @exportGet()
  
  componentWillReceiveProps: (newProps)->
    @exportGet() if newProps.exportType isnt @props.exportType

  getInitialState: ->
    isAvailable: null
    exportRequested: false
    exportError: null
    mostRecent: null

  exportGet: ->
    @_exportsGet or= talkClient.type('data_requests').get(section: @section(), kind: @props.exportType).then (requests) =>
      if requests.length > 0
        [mostRecent] = requests
        isAvailable = true
        @setState {mostRecent, isAvailable}

  section: ->
    "project-#{ @props.project.id }"

  requestDataExport: ->
    @setState exportError: null
    talkClient.type('data_requests').create(section: @section(), kind: @props.exportType).save()
      .then (data_request) =>
        @_exportsGet = null
        @setState 
          exportRequested: true
          mostRecent: data_request
      .catch (error) =>
        @setState exportError: error

  render: ->
    <div>
      <button type="button" disabled={@state.exportRequested or @state.isAvailable} onClick={@requestDataExport}>
        {@props.label}
      </button> {' '}
      <small className="form-help">
        JSON format.{' '}
        {if @state.mostRecent? and @state.mostRecent?.url
          <span>
            Most recent data available requested {moment(@state.mostRecent.created_at).fromNow()}:{' '}
            <a href={@state.mostRecent.url}>Download</a>.
            Available until {moment(@state.mostRecent.expires_at).calendar()}.
          </span>
        else if @state.mostRecent?
          <span>
            Most recent data available requested {moment(@state.mostRecent.created_at).fromNow()}:{' '}{@state.mostRecent.state}
          </span>
        else
          <span>No recent requests</span>
        }
        <br />
      </small>

      {if @state.exportError?
         <div className="form-help error">{@state.exportError.toString()}</div>
       else if @state.exportRequested
         <div className="form-help success">
           We’ve received your request, check your email for a link to your data soon!
         </div>}
    </div>
