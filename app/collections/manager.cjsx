React = require 'react'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
auth = require '../api/auth'

module?.exports = React.createClass
  displayName: 'CollectionsManager'

  getInitialState: ->
    collections: []

  propTypes:
    subject: React.PropTypes.object

  componentWillMount: ->
    @setCollections()

  setCollections: ->
    auth.checkCurrent().then (user) =>
      @props.subject.get('project').then (project) =>
        user.get('collections', {project_id: project.id})
          .then (collections) =>
            @setState {collections}

  setCollectionMembership: (collection, subject, bool) ->
    if bool
      collection.addLink('subjects', [subject.id.toString()])
    else
      collection.removeLink('subjects', [subject.id.toString()])

  onSubmitNewCollection: (e) ->
    e.preventDefault()
    nameInput = @refs.newCollectionName.getDOMNode()

    @props.subject.get('project').then (project) =>
      auth.checkCurrent().then (user) =>
        display_name = nameInput.value
        owner = {id: user.id.toString(), type: "users"}
        project = project.id.toString()
        links = {owner, project}
        collection = {display_name, links}
        nameInput.value = ''

        apiClient.type('collections').create(collection).save()
          .then (collection) =>
            @setCollectionMembership(collection, @props.subject, true)
              .then @setCollections

  collection: (data, i) ->
    <PromiseRenderer promise={apiClient.type('subjects').get({collection_id: data.id, id: @props.subject.id}).index(0)}>{(subject) =>
      <p>
        <label key={data.i}>
          <input type="checkbox" onChange={=>
            @setCollectionMembership(data, @props.subject, !subject)
              .then @setCollections
          } checked={!!subject}/>
          {data.display_name}
        </label>
      </p>
    }</PromiseRenderer>

  render: ->
    <div className="collections-manager">
      <h1>Subject {@props.subject.id} Collections</h1>

      <section>
       {if @state.collections.length
          @state.collections.map(@collection)
        else
          <p>You have not started any collections for this project.</p>}
      </section>

      <form onSubmit={@onSubmitNewCollection}>
        <input
          type="text"
          ref="newCollectionName"
          placeholder="Start a new collection"/>
      </form>
    </div>
