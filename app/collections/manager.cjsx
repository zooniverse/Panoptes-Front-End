React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
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
    collections = @refs.search.getSelected()
    return unless collections.length > 0

    promises = for { collection } in collections
      collection.addLink('subjects', [@props.subject.id])

    Promise.all(promises)
      .then =>
        @props.onSuccess()
      .catch (error) =>
        @setState { error }

  render: ->
    <div className="collections-manager">
      <h1>Add Subject to Collection</h1>

      <div>
        {if @state.error?
          <div className="form-help error">{@state.error.toString()}</div>}
        <CollectionSearch
          ref="search"
          multi={true}
          project={@props.project}
          onChange={@handleChange} />
        <button type="button" className="standard-button search-button" disabled={if @state.hasCollectionSelected then true else false} onClick={@addToCollections}>
          Add
        </button>
      </div>

      <hr />

      <div className="form-help">Or Create a new Collection</div>
      <CollectionsCreateForm project={@props.project?.id} subject={@props.subject.id} onSubmit={@props.onSuccess} />
    </div>
