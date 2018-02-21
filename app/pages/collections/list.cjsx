React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
`import CollectionCard from './collection-card';`
Translate = require 'react-translate-component'
{ Helmet } = require 'react-helmet'
{Link} = require 'react-router'
counterpart = require 'counterpart'
CollectionsNav = require './nav'
classNames = require 'classnames'
Paginator = require '../../talk/lib/paginator'

counterpart.registerTranslations 'en',
  collectionsList:
    all: 'All'

List = createReactClass
  displayName: 'List'

  contextTypes:
    router: PropTypes.object.isRequired

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

  componentDidMount: ->
    @listCollections @props

  componentWillReceiveProps: (nextProps) ->
    if nextProps.user isnt @props.user
      @listCollections nextProps

    newRoute = @props.route?.path isnt nextProps.route?.path
    if nextProps.location.query.page isnt @props.location.query.page || newRoute
      @listCollections nextProps

  cardLink: (collection) ->
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    "#{baseLink}collections/#{collection.slug}"

  onPageChange: (page) ->
    nextQuery = Object.assign {}, @props.location.query, { page }
    @context.router.push
      pathname: @props.location.pathname
      query: nextQuery

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

  title: ->
    capitalizedBase = @props.baseType.charAt(0).toUpperCase() + @props.baseType.slice(1)
    owner =
      if @props.params.collection_owner?
        @props.params.collection_owner
      else if @props.params.name
        @props.params.name
      else counterpart "collectionsList.all"
    "#{capitalizedBase} » #{owner}"

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
      <Helmet title={@title()} />
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
                  linkTo={@cardLink(collection)}
                  translationObjectName={@props.translationObjectName}
                  shared={@shared(collection)}
                />}
            </div>
            <nav>
              {if meta
                buttonClasses = classNames {
                  "pill-button": true
                  "project-pill-button": @props.project?
                }
                <nav className="pagination">
                  <Paginator
                    className='talk'
                    page={meta.page}
                    onPageChange={@onPageChange}
                    pageCount={meta.page_count} />
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
