React = require 'react'
CollectionCreateForm = require './create-form'
talkClient = require '../api/talk'
apiClient = require '../api/client'
authClient = require '../api/auth'
auth = require '../api/auth'
{Link} = require 'react-router'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'

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
      <ChangeListener target={authClient}>{=>
        <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
          if user?
            <PromiseRenderer promise={user.get('collections')}>{(collections) =>
              <div>
                <CollectionCreateForm />
                {collections.map(@collectionLink)}
              </div>
            }</PromiseRenderer>
          else
            <p>Please sign-in to view your collections</p>
        }</PromiseRenderer>
      }</ChangeListener>
    </div>
