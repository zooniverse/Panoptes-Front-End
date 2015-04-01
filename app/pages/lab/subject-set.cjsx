React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'

EditSubjectSetPage = React.createClass
  displayName: 'EditSubjectSetPage'

  getDefaultProps: ->
    subjectSet: null

  render: ->
    <div>
      <p><small>TODO</small></p>
      <div>
        Name<br />
        <input type="text" name="display_name" value={@props.subjectSet.display_name} onChange={handleInputChange.bind @props.subjectSet} />
      </div>
      <div>
        (Retirement rules editor)
      </div>
      <div>
        (Subject set editor)
      </div>
    </div>

module.exports = React.createClass
  displayName: 'EditSubjectSetPageWrapper'

  getDefaultProps: ->
    params: null

  render: ->
    <PromiseRenderer promise={apiClient.type('subject_sets').get @props.params.subjectSetID}>{(subjectSet) =>
      <ChangeListener target={subjectSet}>{=>
        <EditSubjectSetPage {...@props} subjectSet={subjectSet} />
      }</ChangeListener>
    }</PromiseRenderer>
