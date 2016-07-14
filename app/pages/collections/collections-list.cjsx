React = require 'react'
TitleMixin = require '../../lib/title-mixin'
List = require './list'

CollectionsList = React.createClass
  displayName: 'CollectionsPage'
  mixins: [TitleMixin]
  title: 'Collections'

  render: ->
    translationObjectName = "collectionsPage"
    if @props.routes[1]=="collections" or @props.routes[1]=="favorites"
      translationObjectName = "#{@props.routes[1]}Page"
    else if @props.routes[2]=="collections" or @props.routes[2]=="favorites"
      translationObjectName = "#{@props.routes[2]}Page"
    if @props.project?
      translationObjectName = "project#{translationObjectName}"
    props = Object.assign({}, @props, {favorite: false, translationObjectName:"#{translationObjectName}"})
    <List {...props} />

module.exports = CollectionsList
