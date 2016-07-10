counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../../lib/title-mixin'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  collectionsPage:
    title: '%(user)s Collections'
    countMessage: 'Showing %(count)s found'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'
    myCollections: 'My Collections'
    favorites: 'My Favorites'
    all: 'All'
  favoritesPage:
    title: '%(user)s Favorites'
    countMessage: 'Showing %(count)s found'
    button: 'View Favorites Collection'
    loadMessage: 'Loading Favorites Collections'
    notFoundMessage: 'No Favorites Collections Found'
    myCollections: 'My Collections'
    favorites: 'My Favorites'
    all: 'All'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'

  contextTypes:
    geordi: React.PropTypes.object

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'collect-menu'

  render: ->
    <nav className="hero-nav">
      <IndexLink to="/collections" activeClassName="active" onClick={@logClick?.bind(this, "#{@props.route.path}Page.all")}>
        <Translate content="#{@props.route.path}Page.all" />
      </IndexLink>

      {if @props.user?
        <Link to="/collections/#{@props.user.login}" activeClassName="active" onClick={@logClick?.bind(this, "#{@props.route.path}Page.myCollections")}>
          <Translate content="#{@props.route.path}Page.myCollections" />
        </Link>}
      {if @props.user?
        <Link to="/favorites/#{@props.user.login}" activeClassName="active" onClick={@logClick?.bind(this, "#{@props.route.path}Page.favorites")}>
          <Translate content="#{@props.route.path}Page.favorites" />
        </Link>}
    </nav>

CollectionsContainer = React.createClass

  userForTitle: ->
    if @props.params?.collection_owner?
      "#{@props.params?.collection_owner}'s"
    else
      'All'

  render: ->
    <div className="secondary-page all-resources-page">
      <section className={"hero collections-hero"}>
        <div className="hero-container">
          <Translate component="h1" user={@userForTitle()} content={"#{@props.route.path}Page.title"} />
          <CollectionsNav route={@props.route} user={@props.user} />
        </div>
      </section>
      {if @props.children?
        React.cloneElement @props.children, {project: @props.project, user: @props.user}}
    </div>

module.exports = CollectionsContainer