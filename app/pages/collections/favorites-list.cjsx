React = require 'react'
TitleMixin = require '../../lib/title-mixin'
List = require './list'

FavoritesList = React.createClass
  displayName: 'FavoritesPage'
  mixins: [TitleMixin]
  title: 'Favorites'

  render: ->
    props = List.getPropsForList(@props,true)
    <List {...props} baseType="favorites" />

module.exports = FavoritesList