React = require 'react'
TitleMixin = require '../../lib/title-mixin'
List = require './list'

FavoritesList = React.createClass
  displayName: 'FavoritesPage'
  mixins: [TitleMixin]
  title: 'Favorites'

  componentDidMount: ->
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    props = List.getPropsForList(@props,true)
    <List {...props} baseType="favorites" />

module.exports = FavoritesList