counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../../lib/title-mixin'
Translate = require 'react-translate-component'
CollectionsNav = require './nav'
classNames = require 'classnames'

counterpart.registerTranslations 'en',
  projectcollectionsPage:
    title: '%(user)s %(project)s Collections'
    countMessage: 'Showing %(count)s collections.'
    countForUserMessage: 'Showing %(user)s\'s %(count)s %(project)s collections.'
    button: 'View Collection'
    loadMessage: 'Loading collections...'
    notFoundMessage: 'No collections found'
    all: '%(project)s Collections'
    allZoo: 'All Zooniverse Collections'
    projectWide: 'Show other %(project)s collections...'
    userWide: 'Show all %(user)s\'s Zooniverse collections...'
  projectfavoritesPage:
    title: '%(user)s %(project)s Favorites'
    countMessage: 'Showing %(count)s favorites collections.'
    countForUserMessage: 'Showing %(user)s\'s %(count)s %(project)s favorites collections.'
    button: 'View Favorites Collection'
    loadMessage: 'Loading favorites collections...'
    notFoundMessage: 'No favorites collections found'
    all: '%(project)s Favorites'
    allZoo: 'All Zooniverse Favorites'
    projectWide: 'Show other %(project)s favorites...'
    userWide: 'Show all %(user)s\'s Zooniverse favorites...'
  collectionsPage:
    title: '%(user)s Collections'
    countMessage: 'Showing %(count)s collections.'
    countForUserMessage: 'Showing %(user)s\'s %(count)s collections.'
    loadMessage: 'Loading collections...'
    notFoundMessage: 'No collections found'
    my: 'My Collections'
    all: 'All Collections'
    projectWide: 'Show all Zooniverse collections...'
  favoritesPage:
    title: '%(user)s Favorites'
    countMessage: 'Showing %(count)s favorites collections.'
    countForUserMessage: 'Showing %(user)s\'s %(count)s favorites collections.'
    loadMessage: 'Loading favorites collections...'
    notFoundMessage: 'No favorites collections found'
    my: 'My Favorites'
    all: 'All Favorites'
    projectWide: 'Show all Zooniverse favorites...'

CollectionsContainer = React.createClass

  mixins: [TitleMixin]

  title: ->
    if @props.params.collection_owner? then "#{@props.params.collection_owner}" else "All"

  userForTitle: ->
    if @props.params?.collection_owner?
      "#{@props.params?.collection_owner}'s"
    else
      'All'

  render: ->
    classes = classNames {
      "secondary-page":true
      "all-resources-page": true
      "has-project-context": @props.project?
    }
    attrsForTitle = {
       user: @userForTitle()
       content: "#{@props.route.path}Page.title"
    }
    if @props.project?
      attrsForTitle.content = "project" + attrsForTitle.content
      attrsForTitle.project = @props.project.display_name
    <div className={classes}>
      <section className={"hero collections-hero"}>
        <div className="hero-container">
          <Translate component="h1" {...attrsForTitle} />
          {if !@props.project?
            <CollectionsNav
              route={@props.route}
              translationObjectName="#{@props.route.path}Page"
              user={@props.user}
              project={@props.project} />}
        </div>
      </section>
      {if @props.children?
        React.cloneElement @props.children, {project: @props.project, user: @props.user}}
    </div>

module.exports = CollectionsContainer