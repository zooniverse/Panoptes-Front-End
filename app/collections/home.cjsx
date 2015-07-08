React = require 'react'
CollectionCreateForm = require './create-form'
apiClient = require '../api/client'
{Link} = require 'react-router'

module?.exports = React.createClass
  displayName: 'CollectionsHome'

  collectionLink: (d, i) ->
    <div key={d.id}>
      <Link to="collections-show" params={collection_id: d.id}>
        {d.display_name}
      </Link>
    </div>

  render: ->
    <div className="collections-home">
      {if @props.user?
        <PromiseRenderer promise={@props.user.get('collections')}>{(collections) =>
          <div>
            <CollectionCreateForm />
            {collections.map(@collectionLink)}
          </div>
        }</PromiseRenderer>
      else
        <p>Please sign-in to view your collections</p>}
    </div>
