React = require 'react'
createReactClass = require 'create-react-class'
List = require './list'

FavoritesList = createReactClass
  displayName: 'FavoritesPage'

  render: ->
    props = List.getPropsForList(@props,true)
    <List {...props} baseType="favorites" />

module.exports = FavoritesList
