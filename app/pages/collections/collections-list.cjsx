React = require 'react'
TitleMixin = require '../../lib/title-mixin'
List = require './list'

CollectionsList = React.createClass
  displayName: 'CollectionsPage'
  mixins: [TitleMixin]
  title: 'Collections'

  render: ->
    props = Object.assign({}, @props, {favorite: false, translationObjectName:"collectionsPage"})
    <List {...props} />

module.exports = CollectionsList
