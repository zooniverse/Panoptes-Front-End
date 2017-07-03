React = require 'react'
List = require './list'
`import defineTitle from '../../lib/define-title';`

FavoritesList = React.createClass
  displayName: 'FavoritesPage'
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

FavoritesListWithTitle = defineTitle FavoritesList

module.exports = FavoritesListWithTitle
