React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../components/loading-indicator'
Thumbnail = require '../components/thumbnail'
Avatar = require '../partials/avatar'
getSubjectLocation = require '../lib/get-subject-location'

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
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    <div className="collection-preview">
      <div className="collection">
        <p className="title">
          <Link to="#{baseLink}collections/#{collection.slug}">
            {@props.collection.display_name}
          </Link>
          {' '}by{' '}
          {if @state.owner
            <Link className="user-profile-link" to="#{baseLink}users/#{@state.owner.login}">
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
