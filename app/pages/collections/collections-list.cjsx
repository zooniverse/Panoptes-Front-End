React = require 'react'
TitleMixin = require '../../lib/title-mixin'
List = require './list'

CollectionsList = React.createClass
  displayName: 'CollectionsPage'
  mixins: [TitleMixin]
  title: 'Collections'

  render: ->
    props = List.getPropsForList(@props,false)
    <List {...props} />

module.exports = CollectionsList
