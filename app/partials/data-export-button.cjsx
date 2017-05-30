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
    showButton: true
    mostRecent: null

  componentDidMount: ->
    @exportGet()
    @showDataExportBtn()

  componentWillReceiveProps: ->
    @exportGet()
    @showDataExportBtn()

  exportGet: ->
    @props.project.get(@props.exportType)
      .then ([exported]) =>
        @setState mostRecent: exported
        @showDataExportBtn()
      .catch (error) =>
        console.error error

  showDataExportBtn: ->
    if @props.exportType isnt 'aggregations_export'
      @setState showButton: true
    else if @state?.mostRecent?.metadata?.state?
      @setState showButton: true
    else
      @setState showButton: false

  requestDataExport: ->
    @setState exportError: null
    apiClient.post @props.project._getURL(@props.exportType), media: content_type: @props.contentType
      .then =>
        @setState exportRequested: true
      .catch (error) =>
        @setState exportError: error

  recentAndReady: (exported) ->
    exported? and (exported.metadata.state is 'ready' or not exported.metadata.state?)

  pending: (exported) ->
    exported?

  render: ->
    <div>
      { if @state.showButton
        <div>
          { if @props.newFeature
            <i className="fa fa-cog fa-lg fa-fw"></i> }
          <button type="button" disabled={@state.exportRequested or @props.exportType is "aggregations_export"} onClick={@requestDataExport}>
            <Translate content={@props.buttonKey} />
          </button> {' '}
          <small className="form-help">
            CSV format.{' '}
            { if @recentAndReady(@state.mostRecent)
                <span>
                  Most recent data available requested{' '}
                  <a href={@state.mostRecent.src}>{moment(@state.mostRecent.updated_at).fromNow()}</a>.
                </span>
              else if @pending(@state.mostRecent)
                <span>
                  Processing your request.
                </span>
              else
                <span>Never previously requested.</span>}
            <br />
          </small>

          {if @state.exportError?
             <div className="form-help error">{@state.exportError.toString()}</div>
           else if @state.exportRequested
             <div className="form-help success">
               We’ve received your request, check your email for a link to your data soon!
             </div>}
        </div> }
    </div>

