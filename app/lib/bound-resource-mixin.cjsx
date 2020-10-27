handleInputChange = require('./handle-input-change').default

DEFAULT_UNSAVED_CHANGES_WARNING = '''
    Are you sure you want to leave this page?
    **You will lose your unsaved changes.**
  '''

DEFAULT_DELETE_WARNING = '''
  Do you really want to delete this forever?
'''

module.exports =
  statics:
    willTransitionFrom: (transition, component) ->
      resource = component._getResource()

      if resource?.hasUnsavedChanges()
        confirmLeave = confirm component.unsavedChangesWarning ? DEFAULT_UNSAVED_CHANGES_WARNING

        if confirmLeave
          setTimeout ->
            resource.refresh()
        else
          transition.abort()

  getInitialState: ->
    saveError: null
    saveInProgress: false
    saved: false
    deleteError: null
    deleteInProgress: false

  _getResource: ->
    if typeof @boundResource is 'function'
      @boundResource()
    else if typeof @boundResource is 'string'
      @props[@boundResource]
    else
      throw new Error 'Define `Component::boundResource` when using BoundResourceMixin.'

  handleChange: ->
    @setState saved: false
    handleInputChange.apply @_getResource(), arguments

  saveResource: ->
    @setState
      saveInProgress: true
      saveError: null
      saved: false

    @_getResource().save()
      .then =>
        @setState saved: true
      .catch (error) =>
        @setState saveError: error
      .then =>
        @setState saveInProgress: false

  renderSaveStatus: ->
    if @state.saveInProgress
      <span className="form-help">Saving...</span>
    else if @state.saveError
      <span className="form-help error">{@state.saveError.message}</span>
    else if @state.saved and not @_getResource().hasUnsavedChanges()
      <span className="form-help success">Saved!</span>
    else
      null

  deleteResource: (afterDelete) ->
    confirmation = confirm @deleteWarning ? DEFAULT_DELETE_WARNING
    if confirmation
      @setState
        deleteError: null
        deleteInProgress: true

      @_getResource().delete()
        .catch (error) =>
          @setState deleteError: error
        .then =>
          @setState deleteInProgress: false
        .then afterDelete
