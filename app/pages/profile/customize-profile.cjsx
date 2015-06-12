counterpart = require 'counterpart'
React = require 'react'
BoundResourceMixin = require '../../lib/bound-resource-mixin'
handleInputChange = require '../../lib/handle-input-change'
ChangeListener = require '../../components/change-listener'
auth = require '../../api/auth'
PromiseRenderer = require '../../components/promise-renderer'
ImageSelector = require '../../components/image-selector'
apiClient = require '../../api/client'
putFile = require '../../lib/put-file'

module.exports = React.createClass
  displayName: 'CustomizeProfile'

  render: ->
    <div>Customize</div>