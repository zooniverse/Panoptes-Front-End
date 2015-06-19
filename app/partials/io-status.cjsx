React = require 'react'
ChangeListener = require '../components/change-listener'
apiClient = require '../api/client'

module.exports = React.createClass
  displayName: 'IOStatus'

  render: ->
    <ChangeListener target={apiClient}>{=>
      {reads, writes} = apiClient

      <span className="io-status" style={pointerEvents: 'none'}>
        <span style={opacity: 0.3 if reads is 0}>
          <i className="fa fa-chevron-down fa-fw"></i>
          {reads}
        </span>
        {' '}
        <span style={opacity: 0.3 if writes is 0}>
          <i className="fa fa-chevron-up fa-fw"></i>
          {writes}
        </span>
      </span>
    }</ChangeListener>
