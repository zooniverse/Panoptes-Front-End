React = require 'react'
TitleMixin = require '../../lib/title-mixin'
List = require './list'

FavoritesList = React.createClass
  displayName: 'FavoritesPage'
  mixins: [TitleMixin]
  title: 'Favorites'

  render: ->
    translationObjectName = "favoritesPage"
    if @props.routes[1]=="collections" or @props.routes[1]=="favorites"
      translationObjectName = "#{@props.routes[1]}Page"
    else if @props.routes[2]=="collections" or @props.routes[2]=="favorites"
      translationObjectName = "#{@props.routes[2]}Page"
    if @props.project?
      translationObjectName = "project#{translationObjectName}"
    props = Object.assign({}, @props, {favorite: true, translationObjectName:"#{translationObjectName}"})
    <List {...props} />

module.exports = FavoritesList