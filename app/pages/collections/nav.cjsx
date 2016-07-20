React = require 'react'
{Link, IndexLink} = require 'react-router'
Translate = require 'react-translate-component'
classNames = require 'classnames'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'

  contextTypes:
    geordi: React.PropTypes.object

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'collect-menu'

  render: ->
    classes = classNames {
      "about-tabs": @props.project?
    }
    baseLink = ""
    messageKeyPrefixToUse = ""
    if @props.project?
      messageKeyPrefixToUse += "project"
      baseLink += "/projects/#{@props.project.slug}"

    <nav className="hero-nav">
      {if @props.project?
        <Link to="/#{@props.baseType}/" className={classes} activeClassName="active" onClick={@logClick?.bind(this, "#{@props.baseType}.allZoo")}>
          <Translate content="project#{@props.baseType}Page.allZoo" />
        </Link>}

      <IndexLink to="#{baseLink}/collections" className={classes} activeClassName="active" onClick={@logClick?.bind(this, "collections.all")}>
        <Translate content="#{messageKeyPrefixToUse}collectionsPage.all" project="#{@props.project?.display_name}"/>
      </IndexLink>

      <IndexLink to="#{baseLink}/favorites" className={classes} activeClassName="active" onClick={@logClick?.bind(this, "favorites.all")}>
        <Translate content="#{messageKeyPrefixToUse}favoritesPage.all" project="#{@props.project?.display_name}"/>
      </IndexLink>

      {if @props.user?
        <span>
          <Link to="#{baseLink}/collections/#{@props.user.login}" className={classes} activeClassName="active" onClick={@logClick?.bind(this, "collections.my")}>
            <Translate content="collectionsPage.my" />
          </Link>
          <Link to="#{baseLink}/favorites/#{@props.user.login}" className={classes} activeClassName="active" onClick={@logClick?.bind(this, "favorites.my")}>
            <Translate content="favoritesPage.my" />
          </Link>
        </span>}

    </nav>

module.exports = CollectionsNav