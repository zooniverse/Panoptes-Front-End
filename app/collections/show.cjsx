React = require 'react'
PromiseToSetState = require '../lib/promise-to-set-state'
talkClient = require '../api/talk'
apiClient = require '../api/client'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
{Navigation} = require 'react-router'

module?.exports = React.createClass
  displayName: 'CollectionShow'
  mixins: [Navigation, PromiseToSetState]

  getInitialState: ->
    subjects: null
    collection: null
    page: null

  componentWillMount: ->
    @setData(1) # start on page 1

  subjectsRequest: ->
    # TODO Fix this on the backend should be able to do @state.collection.get('subjects')
    apiClient.type('subjects').get(collection_id: @state.collection.id, page: @state.page)

  collectionRequest: ->
    console.log(@props.params)
    apiClient.type('collections').get(owner: @props.params?.owner, slug: @props.params?.name)
      .index(0)

  setData: (page) ->
    @collectionRequest().then (collection) =>
      @setState {collection: collection, page: page}, =>
        @subjectsRequest().then (subjects) => @setState subjects: subjects

  goToPage: (n) ->
    @transitionTo(@props.path, @props.params, {page: n})
    @setData(n)

  subject: (d, i) ->
    <SubjectViewer subject=d />

  render: ->
    <div className="collections-show">
      <h1>{@state.collection?.display_name}</h1>
      <section>{@state.subjects?.map(@subject)}</section>

      <Paginator
        page={@state.page}
        onPageChange={@goToPage}
        pageCount={@state.subjects?[0].getMeta()?.page_count} />
    </div>
