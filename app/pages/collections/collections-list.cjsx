React = require 'react'
List = require './list'
`import defineTitle from '../../lib/define-title';`

CollectionsList = React.createClass
  displayName: 'CollectionsPage'
  title: 'Collections'

  componentDidMount: ->
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    props = List.getPropsForList(@props,false)
    <List {...props} baseType="collections" />

CollectionsListWithTitle = defineTitle CollectionsList

module.exports = CollectionsListWithTitle
