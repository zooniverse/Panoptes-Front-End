React = require 'react'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
auth = require '../api/auth'
CollectionsCreateForm = require './create-form'
CollectionSearch = require '../components/collection-search'

module?.exports = React.createClass
  displayName: 'CollectionsManager'

  getInitialState: ->
    error: null
    collections: []

  getDefaultProps: ->
    project: null

  propTypes:
    subject: React.PropTypes.object
    project: React.PropTypes.object

  addToCollections: ->
    console.log(@refs.search, @refs.search.selected, @refs.search.value)
    #promises = for collection in @refs.search.selectedOptions
      #collection.addLink('subjects', [@props.subject.id])
    #Promise.all(promises)
      #.then =>
        #@props.onSuccess()
      #.catch (error) =>
        #@setState {error}

  render: ->
    <div className="collections-manager">
      <h1>Add Subject to a Collection</h1>

      <div>
        {if @state.error?
          <div className="form-help error">{@state.error.toString()}</div>}
        <CollectionSearch
          ref="search"
          multi={true}
          project={@props.project}
          user={@props.user} />
        <button type="button" className="standard-button search-button" onClick={@addToCollections}>
          Add
        </button>
      </div>

      <div className="form-help">Or Create a new Collection</div>
      <CollectionsCreateForm project={@props.project?.id} subject={@props.subject.id} />
    </div>
