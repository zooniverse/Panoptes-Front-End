React = require 'react'
createReactClass = require 'create-react-class'
List = require './list'

CollectionsList = createReactClass
  displayName: 'CollectionsPage'

  render: ->
    props = List.getPropsForList(@props,false)
    <List {...props} baseType="collections" />

module.exports = CollectionsList
