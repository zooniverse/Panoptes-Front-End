React = require 'react'
TitleMixin = require '../../lib/title-mixin'
List = require './list'

FavoritesList = React.createClass
  displayName: 'FavoritesPage'
  mixins: [TitleMixin]
  title: 'Favorites'

  render: ->
    props = Object.assign({}, @props, {favorite: true, translationObjectName:"favoritesPage"})
    <List {...props} />

module.exports = FavoritesList