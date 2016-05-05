React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../components/loading-indicator'
Thumbnail = require '../components/thumbnail'
Avatar = require '../partials/avatar'
getSubjectLocation = require '../lib/get-subject-location'
ContextualLinks = require '../lib/contextual-links'

module?.exports = React.createClass
  displayName: 'CollectionPreview'

  componentWillMount: ->
    @getCollections()

  getInitialState: ->
    subjects: null
    owner: null

  getCollections: ->
    query =
      collection_id: @props.collection.id
      page_size: 3

    @props.collection.get('owner').then (owner) =>
      @setState {owner}

    apiClient.type('subjects').get(query).then (subjects) =>
      @setState {subjects}

  render: ->
    [owner, name] = @props.collection.slug.split('/')
    collectionLink = ContextualLinks.prefixLinkIfNeeded(@props,"/collections/#{owner}/#{name}")

    <div className="collection-preview">
      <div className="collection">
        <p className="title">
          <Link to="#{collectionLink}">
            {@props.collection.display_name}
          </Link>
          {' '}by{' '}
          {if @state.owner
            ownerProfileLink = ContextualLinks.prefixLinkIfNeeded(@props,"/users/#{@state.owner.login}")
            <Link className="user-profile-link" to="#{ownerProfileLink}">
              <Avatar user={@state.owner} />{' '}{@state.owner.display_name}
            </Link>}
        </p>
        <div className="subject-previews">
          {if @state.subjects
            <div>
              {for subject in @state.subjects
                <Thumbnail
                  key={"collection-preview-#{@props.collection.id}-#{subject.id}"}
                  src={getSubjectLocation(subject).src}
                  width={100} />}
            </div>
          else
            <Loading />}
        </div>
      </div>
    </div>
