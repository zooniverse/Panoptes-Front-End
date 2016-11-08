React = require 'react'

module.exports = React.createClass
  displayName: 'MetadataBasedFeedback'

  withinTolerance: (userX, userY, metaX, metaY, tolerance) ->
    distance = Math.sqrt((userY - metaY)**2 + (userX - metaX)**2)
    isWithinTolerance = distance < tolerance
    return isWithinTolerance

  withinAnyTolerance: (userX, userY) ->
    for key, value of @props.subject?.metadata
      if key.indexOf(@props.metaSimCoordXPattern) == 0
        xKey = key
        metaX = parseFloat(@props.subject.metadata[xKey])
        yKey = @props.metaSimCoordYPattern + xKey.substr(2)
        metaY = parseFloat(@props.subject.metadata[yKey])
        tolKey = @props.metaSimTolPattern + xKey.substr(2)
        metaTol = parseFloat(@props.subject.metadata[tolKey])
        if metaX? && metaY? && metaTol?
          if @withinTolerance(userX, userY, metaX, metaY, metaTol)
            return true
      return false

  getDefaultProps: ->
    subject: null
    classification: null
    dudLabel: 'DUD'
    simLabel: 'SIM'
    subjectLabel: 'SUB'
    metaTypeFieldName: '#Type'
    metaSuccessMessageFieldName: '#F_Success'
    metaFailureMessageFieldName: '#F_Fail'
    metaSimCoordXPattern: '#X'
    metaSimCoordYPattern: '#Y'
    metaSimTolPattern: '#Tol'

  render: ->
    subjectClass = @props.subject.metadata[@props.metaTypeFieldName]?.toUpperCase()
    userMadeAnnotation = @props.classification?.annotations?.length > 0 && @props.classification.annotations[0].value.length > 0

    if(!@props.subject?.metadata[@props.metaSuccessMessageFieldName])
      subjectSuccessMessage = ''
    else
      subjectSuccessMessage = @props.subject.metadata[@props.metaSuccessMessageFieldName]

    if(!@props.subject?.metadata[@props.metaFailureMessageFieldName])
      subjectFailureMessage = ''
    else
      subjectFailureMessage = @props.subject?.metadata[@props.metaFailureMessageFieldName]

    userXPos = @props.classification?.annotations[0]?.value[0]?.x
    userYPos = @props.classification?.annotations[0]?.value[0]?.y
    isWithinTolerance = @withinAnyTolerance(userXPos, userYPos)

    if subjectClass == @props.dudLabel
      if userMadeAnnotation == true && subjectFailureMessage
        <p>{subjectFailureMessage}</p>
      else if subjectSuccessMessage
        <p>{subjectSuccessMessage}</p>
    else if subjectClass == @props.simLabel
      if (!(userMadeAnnotation?) || !isWithinTolerance) && subjectFailureMessage
        <p>{subjectFailureMessage}</p>
      else if subjectSuccessMessage
        <p>{subjectSuccessMessage}</p>
    else if subjectSuccessMessage
      <p>You classified some real data!</p>
    else
      <p></p>
