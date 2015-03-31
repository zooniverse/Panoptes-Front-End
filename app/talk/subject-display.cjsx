React = require 'react'
apiClient = require '../api/client'
getSubjectLocation = require '../lib/get-subject-location'
PromiseRenderer = require '../components/promise-renderer'
loadImage = require '../lib/load-image'

module?.exports = React.createClass
  displayName: 'TalkSubjectDisplay'

  propTypes:
    focusId: React.PropTypes.number

  render: ->
    <div className="talk-subject-display">
      <PromiseRenderer promise={apiClient.type('subjects').get(@props.focusId.toString())}>{(subject) =>
        <div>
          <a href={getSubjectLocation(subject).src} target="_blank">
            <img src={getSubjectLocation(subject).src} />
          </a>
          <p>Subject {subject.id}</p>
        </div>
      }</PromiseRenderer>
    </div>
