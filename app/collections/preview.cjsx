React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../components/loading-indicator'
Avatar = require '../partials/avatar'
getSubjectLocation = require '../lib/get-subject-location'

`import Thumbnail from '../components/thumbnail';`

module.exports = React.createClass
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
    radius = if innerWidth < 400 then 75 else 100

    <div className="collection-preview">
      <div className="collection">
        <p className="title">
          <Link to="/projects/#{@props.project.slug}/collections/#{@props.collection.slug}">
            {@props.collection.display_name}
          </Link>
          {' '}by{' '}
          {if @state.owner
            <Link className="user-profile-link" to="/projects/#{@props.project.slug}/users/#{@state.owner.login}">
              <Avatar user={@state.owner} />{' '}{@state.owner.display_name}
            </Link>}
        </p>
        <div className="subject-previews">
          {if @state.subjects
            <Link to="/projects/#{@props.project.slug}/collections/#{@props.collection.slug}">
              <div>
                {for subject in @state.subjects
                  <Thumbnail
                    key={"collection-preview-#{@props.collection.id}-#{subject.id}"}
                    src={getSubjectLocation(subject).src}
                    width={radius} />}
              </div>
            </Link>
          else
            <Loading />}
        </div>
      </div>
    </div>
