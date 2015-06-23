React = require 'react'
talkClient = require '../api/talk'
apiClient = require '../api/client'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
PromiseRenderer = require '../components/promise-renderer'
{Navigation} = require 'react-router'

module?.exports = React.createClass
  displayName: 'CollectionShowList'
  mixins: [Navigation]

  getInitialState: ->
    page: 1 # start on page 1

  subjectsRequest: ->
    # TODO Fix this on the backend should be able to do @state.collection.get('subjects')
    apiClient.type('subjects').get(collection_id: @props.collection.id, page: @state.page)

  goToPage: (n) ->
    @transitionTo(@props.path, @props.params, {page: n})
    @setState(page: n)

  subject: (sub) ->
    <SubjectViewer defaultStyle={false} key={sub.id} subject={sub} />

  render: ->
    <div className="collections-show">
      <PromiseRenderer promise={@subjectsRequest()}>{(subjects) =>
        <div>
          <section>{subjects?.map(@subject)}</section>

          <Paginator
            page={@state.page}
            onPageChange={@goToPage}
            pageCount={subjects?[0].getMeta()?.page_count} />
        </div>
      }</PromiseRenderer>
    </div>
