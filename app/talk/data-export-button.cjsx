React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
talkClient = require 'panoptes-client/lib/talk-client'
moment = require 'moment'

module.exports = React.createClass
  displayName: 'DataExportButton'

  getInitialState: ->
    isAvailable: null
    exportRequested: false
    exportError: null

  exportGet: ->
    @_exportsGet or= talkClient.type('data_requests').get(section: @section(), kind: @props.exportType).then (requests) =>
      @setState(isAvailable: true) if requests.length > 0
      requests

  section: ->
    "project-#{ @props.project.id }"

  requestDataExport: ->
    @setState exportError: null
    talkClient.type('data_requests').create(section: @section(), kind: @props.exportType).save()
      .then =>
        @_exportsGet = null
        @setState exportRequested: true
      .catch (error) =>
        @setState exportError: error

  render: ->
    <div>
      <button type="button" disabled={@state.exportRequested or @state.isAvailable} onClick={@requestDataExport}>
        {@props.label}
      </button> {' '}
      <small className="form-help">
        JSON format.{' '}
        <PromiseRenderer promise={@exportGet()}>{([mostRecent]) =>
          if mostRecent? and mostRecent?.url
            <span>
              Most recent data available requested {moment(mostRecent.created_at).fromNow()}:{' '}
              <a href={mostRecent.url}>Download</a>.
              Available until {moment(mostRecent.expires_at).calendar()}.
            </span>
          else if mostRecent?
            <span>
              Most recent data available requested {moment(mostRecent.created_at).fromNow()}:{' '}{mostRecent.state}
            </span>
          else
            <span>No recent requests</span>
        }</PromiseRenderer>
        <br />
      </small>

      {if @state.exportError?
         <div className="form-help error">{@state.exportError.toString()}</div>
       else if @state.exportRequested
         <div className="form-help success">
           We’ve received your request, check your email for a link to your data soon!
         </div>}
    </div>
