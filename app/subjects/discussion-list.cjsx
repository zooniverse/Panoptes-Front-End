React = require 'react'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
DiscussionPreview = require '../talk/discussion-preview'
Loading = require('../components/loading-indicator').default

module.exports = createReactClass
  displayName: 'SubjectDiscussionList'

  componentWillMount: ->
    @getDiscussions()

  getInitialState: ->
    discussions: null

  getDiscussions: ->
    query =
      section: @props.section
      focus_id: @props.subject.id
      focus_type: 'Subject'
      page_size: 20
      sort: '-created_at'

    talkClient.type('discussions').get(query).then (discussions) =>
      @setState {discussions}

  render: ->
    return <Loading /> unless @state.discussions

    if @state.discussions.length > 0
      <div>
        <h2>Discussions:</h2>
        <div>
          {for discussion in @state.discussions
            <DiscussionPreview
              {...@props}
              key={"discussion-#{ discussion.id }"}
              discussion={discussion}
              locked={true}
              linked={true} />}
        </div>
      </div>
    else
      <p>There are no discussions yet</p>
