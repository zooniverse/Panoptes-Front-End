React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
moment = require 'moment'
Translate = require 'react-translate-component'

module.exports = React.createClass
  displayName: 'DataExportButton'

  getDefaultProps: ->
    contentType: 'text/csv'
    newFeature: false

  getInitialState: ->
    exportRequested: false
    exportError: null

  exportGet: ->
    @_exportsGet or= @props.project.get(@props.exportType).catch( -> [])

  requestDataExport: ->
    @setState exportError: null
    apiClient.post @props.project._getURL(@props.exportType), media: content_type: @props.contentType
      .then =>
        @_exportsGet = null
        @setState exportRequested: true
      .catch (error) =>
        @setState exportError: error

  recentAndReady: (exported) ->
    exported? and (exported.metadata.state is 'ready' or not exported.metadata.state?)

  pending: (exported) ->
    exported?

  render: ->
    <div>
      { if @props.newFeature
        <i className="fa fa-cog fa-lg fa-fw"></i> }
      <button type="button" disabled={@state.exportRequested} onClick={@requestDataExport}>
        <Translate content={@props.buttonKey} />
      </button> {' '}
      <small className="form-help">
        CSV format.{' '}
        <PromiseRenderer promise={@exportGet()}>{([mostRecent]) =>
          if @recentAndReady(mostRecent)
            <span>
              Most recent data available requested{' '}
              <a href={mostRecent.src}>{moment(mostRecent.updated_at).fromNow()}</a>.
            </span>
          else if @pending(mostRecent)
            <span>
              Processing your request.
            </span>
          else
            <span>Never requested.</span>
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
