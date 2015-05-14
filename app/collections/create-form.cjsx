React = require 'react'
apiClient = require '../api/client'

module?.exports = React.createClass
  displayName: 'CollectionsCreateForm'

  onSubmit: (e) ->
    e.preventDefault()
    form = React.findDOMNode(@).querySelector('form')
    input = form.querySelector('input')

    display_name = input.value
    # links = {project: 76} # optional project attachment
    collection = {display_name, links}

    apiClient.type('collections').create(collection).save()
      .then (collection) =>
        console.log "collection created", collection
        input.value = ''
      .catch (e) ->
        throw new Error(e)

  render: ->
    <div>
      <form onSubmit={@onSubmit} className='collections-create-form'>
        <input placeholder="Collection Name" />
        <button type="submit">Add Collection</button>
      </form>
    </div>
