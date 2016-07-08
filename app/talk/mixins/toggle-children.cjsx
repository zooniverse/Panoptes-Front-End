# mixin --- toggle-children.cjsx

module.exports =
  getInitialState: ->
    showing: null # string name of child component to show

  toggleComponent: (name) ->
    @setState showing: if @state.showing is name then null else name

  hideChildren: ->
    @setState showing: null
