React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
`import CollectionCard from './collection-card';`
Translate = require 'react-translate-component'
{Link} = require 'react-router'
CollectionsNav = require './nav'
classNames = require 'classnames'
`import getCollectionCovers from '../../lib/get-collection-covers';`

List = React.createClass
  displayName: 'List'

  statics: {
    getPropsForList: (props,favorite)->
      translationObjectName = "collectionsPage"
      for pos in [1..3]
        if props.routes[pos].path is "collections" or props.routes[pos].path is "favorites"
          translationObjectName = "#{props.routes[pos].path}Page"
          break
      if props.project?
        translationObjectName = "project#{translationObjectName}"
      Object.assign({}, props, {favorite: favorite, translationObjectName:"#{translationObjectName}"})
  }

  getInitialState: ->
    collections: null # has to be null initially, rather than [], in order to display the loading message
    collectionCovers: {}

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'
    @listCollections @props

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  componentWillReceiveProps: (nextProps) ->
    if nextProps.user isnt @props.user
      @listCollections nextProps

    if nextProps.location.query.page isnt @props.location.query.page
      @listCollections nextProps

  cardLink: (collection) ->
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    "#{baseLink}collections/#{collection.slug}"

  listCollections: (props) ->
    query = {}
    if props.params.collection_owner is props.user?.login
      query.current_user_roles = "owner,contributor,collaborator,viewer"
    else if props.params.collection_owner?
      query.owner = props.params.collection_owner

    if props.params.profile_name is props.user?.login
      query.current_user_roles = "owner,contributor,collaborator,viewer"
    else if props.params.profile_name?
      query.owner = props.params.profile_name

    if props.project?
      query.project_ids = props.project.id
    query.favorite = props.favorite
    query.sort = 'display_name'
    Object.assign query, props.location.query

    apiClient
      .type 'collections'
      .get query
      .then (collections) =>
        @setState {collections}
        getCollectionCovers(collections).then (collectionCovers) =>
          @setState {collectionCovers}

  shared: (collection) ->
    if (@props.params.collection_owner is @props.user?.login) or (@props.params.profile_name is @props.user?.login)
      @props.user and @props.user?.id isnt collection.links.owner.id

  render: ->
    {location} = @props
    classes = classNames {
      "resources-container": true
      "collections-container": true
      "in-project-context": @props.project?
    }

    baseLink = if @props.project? then "/projects/#{@props.project.slug}" else ""
    projectCollectionsLink = "#{baseLink}/#{@props.baseType}/"
    if @props.params.profile_name?
      username = @props.params.profile_name
    else if @props.params.collection_owner?
      username = @props.params.collection_owner
    if username?
      userCollectionsLink = "/users/#{username}/#{@props.baseType}"

    <section className={classes}>
      {if !@props.params.profile_name? and @props.project?
        <CollectionsNav
          translationObjectName="#{@props.translationObjectName}"
          user={@props.user}
          project={@props.project}
          baseType={@props.baseType} />}
        {if @state.collections?.length > 0
          meta = @state.collections[0].getMeta()
          <div>
            <div className="resource-results-counter collection-results-counter">
              <p>
                {if meta
                  pageStart = meta.page * meta.page_size - meta.page_size + 1
                  pageEnd = Math.min(meta.page * meta.page_size, meta.count)
                  count = meta.count
                  translateProps = {
                    pageStart: pageStart
                    pageEnd: pageEnd
                    count: count
                  }
                  if @props.project?
                    projectNameForMessages = @props.project.display_name
                  else
                    projectNameForMessages = "Zooniverse"
                  translateProps["project"] = projectNameForMessages
                  if username?
                    countMessageKey = "#{@props.translationObjectName}.countForUserMessage"
                    translateProps["user"] = username
                  else
                    countMessageKey = "#{@props.translationObjectName}.countMessage"
                  <Translate {...translateProps} content={countMessageKey}/>}
                {if @props.params.profile_name? or @props.params.collection_owner?
                  <span>
                    <br/>
                    {if @props.params.profile_name?
                      <Link className="show-more" to={projectCollectionsLink}>
                        <Translate content="#{@props.translationObjectName}.projectWide" project={projectNameForMessages}/>
                      </Link>}
                    {if username? and @props.project?
                      <Link className="show-more" to={userCollectionsLink}>
                        <Translate content="#{@props.translationObjectName}.userWide" user={username}/>
                      </Link>}
                  </span>}
              </p>
            </div>
            <div className="collections-card-list">
              {for collection in @state.collections
                 <CollectionCard
                   key={collection.id}
                   collection={collection}
                   coverSrc={@state.collectionCovers[collection.id]}
                   linkTo={@cardLink(collection)}
                   translationObjectName={@props.translationObjectName}
                   subjectCount={collection.links.subjects?.length}
                   shared={@shared(collection)} /> }
            </div>
            <nav>
              {if meta
                buttonClasses = classNames {
                  "pill-button": true
                  "project-pill-button": @props.project?
                }
                <nav className="pagination">
                  {for page in [1..meta.page_count]
                    active = (page is +location.query.page) or (page is 1 and not location.search)
                    <Link
                      key={page}
                      to={"#{@props.location.pathname}?page=#{page}"}
                      activeClassName="active"
                      className={buttonClasses}
                      style={border: "2px solid" if active}>
                      {page}
                    </Link>}
                </nav>}
            </nav>
          </div>
        else if @state.collections?.length is 0
          <div>
            <div className="resource-results-counter collection-results-counter">
              <Translate content="#{@props.translationObjectName}.notFoundMessage" component="p" />
            </div>
          </div>
        else
          <div>
            <div className="resource-results-counter collection-results-counter">
              <Translate content="#{@props.translationObjectName}.loadMessage" component="p" />
            </div>
          </div>
        }
    </section>

module.exports = List
