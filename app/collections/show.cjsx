React = require 'react'
PromiseToSetState = require '../lib/promise-to-set-state'
talkClient = require '../api/talk'
apiClient = require '../api/client'
getSubjectLocation = require '../lib/get-subject-location'
Paginator = require '../talk/lib/paginator'
{Navigation} = require 'react-router'

module?.exports = React.createClass
  displayName: 'CollectionShow'
  mixins: [Navigation, PromiseToSetState]

  getInitialState: ->
    subjects: []
    subjectsMeta: {}
    collection: {}

  componentWillMount: ->
    @setData(1) # start on page 1

  subjectsRequest: (page) ->
    collection_id = @props.params?.collection_id
    apiClient.type('subjects').get({page, collection_id})

  collectionRequest: ->
    apiClient.type('collections').get({id: +@props.params?.collection_id}).index(0)

  setData: (page) ->
    @subjectsRequest(page).then (subjects) =>
      @setState {subjectsMeta: subjects[0]?.getMeta()}, =>
        @promiseToSetState {
          collection: @collectionRequest()
          subjects: @subjectsRequest(page)
          }

  goToPage: (n) ->
    @transitionTo(@props.path, @props.params, {page: n})
    @setData(n)

  subject: (d, i) ->
    <img key={d.id} src={getSubjectLocation(d).src} />

  render: ->
    <div className="collections-show">
      Collection Show:
      <section>{@state.collection?.display_name}</section>
      <section>{@state.subjects.map(@subject)}</section>

      <Paginator
        page={+@state.subjectsMeta.page}
        onPageChange={@goToPage}
        pageCount={@state.subjectsMeta?.page_count} />
    </div>
