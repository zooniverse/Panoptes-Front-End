React = require 'react'
ChangeListener = require '../components/change-listener'
apiClient = require '../api/client'

module.exports = React.createClass
  displayName: 'IOStatus'

  render: ->
    <ChangeListener target={apiClient} handler={@really} />

  really: ->
    <span className="io-status">
      <span style={opacity: 0.4 if apiClient.reads is 0}>
        <i className="fa fa-chevron-down fa-fw"></i>
        {apiClient.reads}
      </span>
      {' '}
      <span style={opacity: 0.3 if apiClient.reads is 0}>
        <i className="fa fa-chevron-up fa-fw"></i>
        {apiClient.writes}
      </span>
    </span>
