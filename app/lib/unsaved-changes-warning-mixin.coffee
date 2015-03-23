DEFAULT_UNSAVED_CHANGES_WARNING = '''
    Are you sure you want to leave this page?
    **You will lose your unsaved changes.**
  '''

module.exports =
  statics:
    willTransitionFrom: (transition, component) ->
      if component.props.project.hasUnsavedChanges()
        confirmLeave = confirm component.unsavedChangesWarning ? DEFAULT_UNSAVED_CHANGES_WARNING

        if confirmLeave
          component.props.project.refresh()
        else
          transition.abort()
