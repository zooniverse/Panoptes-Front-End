React = require 'react'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'

module.exports = createReactClass
  displayName: 'IOStatus'

  getDefaultProps: ->
    target: apiClient
    confirmation: 'Some data hasn’t finished syncing, please wait just a second!'
    style:
      background: 'rgba(0, 0, 0, 0.5)'
      borderRadius: '0 0 0.3em 0.3em'
      color: 'white'
      fontSize: '11px'
      fontWeight: 'bold'
      left: '50%'
      padding: '0 1.5em'
      position: 'fixed'
      textTransform: 'uppercase'
      top: 0
      transform: 'translateX(-50%)'

  getInitialState: ->
    reads: @props.target.reads
    writes: @props.target.writes

  componentDidMount: ->
    @props.target.listen 'change', @handleTargetChange
    addEventListener 'beforeunload', @handlePageExit

  componentWillReceiveProps: (nextProps) ->
    @props.target.stopListening 'change', @handleTargetChange
    nextProps.target.listen 'change', @handleTargetChange

  componentWillUnmount: ->
    @props.target.stopListening 'change', @handleTargetChange
    removeEventListener 'beforeunload', @handlePageExit

  handleTargetChange: ->
    setTimeout => # TODO: I have no idea why this is necessary.
      {reads, writes} = @props.target
      @setState {reads, writes}

  render: ->
    {reads, writes} = @state

    rootStyle =
      pointerEvents: 'none'
      zIndex: 1
    if reads is 0 and writes is 0
      rootStyle.display = 'none'

    <span style={rootStyle}>
      <span className="io-status" style={@props.style}>
        <span style={visibility: 'hidden' if reads is 0 and writes is 0}>
          <i className="fa fa-spinner fa-spin fa-fw"></i>
        </span>
        {' '}
        Loading
        &ensp;
        <span style={opacity: 0.3 if reads is 0}>
          <i className="fa fa-chevron-down fa-fw"></i>
          {reads}
        </span>
        &ensp;
        <span style={opacity: 0.3 if writes is 0}>
          <i className="fa fa-chevron-up fa-fw"></i>
          {writes}
        </span>
      </span>
    </span>

  handlePageExit: (e) ->
    unless @state.writes is 0
      e.returnValue = @props.confirmation
      @props.confirmation
