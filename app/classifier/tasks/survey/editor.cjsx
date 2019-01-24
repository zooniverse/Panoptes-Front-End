React = require 'react'
createReactClass = require 'create-react-class'
FileButton = require '../../../components/file-button'
alert = require('../../../lib/alert').default
Details = require '../../../components/details'
TriggeredModalForm = require 'modal-form/triggered'
surveyEditorHelp = require('./editor-help').default
AutoSave = require '../../../components/auto-save'
handleInputChange = require '../../../lib/handle-input-change'
NextTaskSelector = require '../next-task-selector'
# `import MediaArea from '../../../pages/lab/media-area/';`
MediaArea = require('../../../pages/lab/media-area/').default
{Markdown} = require 'markdownz'
Papa = require 'papaparse'
getAllLinked = require('../../../lib/get-all-linked').default

module.exports = createReactClass
  displayName: 'SurveyTaskEditor'

  getDefaultProps: ->
    workflow: null
    task: {}
    taskPrefix: ''

  getInitialState: ->
    importErrors: []
    resettingFiles: false
    editing: 'data'
    # copying entire task Object to edit in @state...
    task: JSON.parse JSON.stringify @props.task
    choicesName: null
    characteristicsName: null
    confusionsName: null
    questionsName: null

  componentWillReceiveProps: (nextProps) ->
    if nextProps.task isnt @props.task
      @clearState()
      @setState
        task: JSON.parse JSON.stringify nextProps.task

  render: ->
    contentWarnings = @checkContentWarnings()

    <div className="workflow-task-editor">
      <span className="form-label">INSTRUCTIONS</span>
      <p><small>The survey task is ideal for asking volunteers to identify wildlife species in camera trap photos, but can be used anytime you have a lot of choices you need volunteers to filter from.</small></p>
      <p><small><a href="https://www.zooniverse.org/projects/aliburchard/cameratraptest/about/faq">See here</a> for detailed instructions.</small></p>
      <p><small><a href="http://bit.ly/1QSpevJ">Click here</a> to download Choices, Characteristics, Confusions and Questions templates.</small></p>
      <p><small>You can Apply changes after adding an individual csv file or many csv files.</small></p>
      <hr />

      <p>
        <span className="form-label">FILE INPUT</span>
        {unless @checkApply()
          <span className="form-label warning"> ** WARNING: unapplied content **</span>}
      </p>
      <div className="survery-editor-input">
        <div className="tabs">
          <div className={if @state.editing is 'data' then "tab-active" else "tab-inactive"} onClick={@handleImportTabs.bind this, 'data'}>Data</div>
          <div className={if @state.editing is 'images' then "tab-active" else "tab-inactive"} onClick={@handleImportTabs.bind this, 'images'}>Images</div>
        </div>
        {if @state.editing is 'data'
          <div className="tab-content">
            <div className="columns-container" style={marginBottom: '0.2em'}>
              <FileButton className="major-button column" accept=".csv, .tsv" onSelect={@handleFiles.bind this, 'choicesName', @addChoice, null}>{if @state.task.choicesOrder.length is 0 then "Add" else "Replace"} choices</FileButton>
              <TriggeredModalForm trigger={
                <span className="secret-button">
                <i className="fa fa-question-circle"></i>
                </span>
                }>
                {surveyEditorHelp.choices}
                </TriggeredModalForm>
              {if @state.choicesName?
                <span className="filename">{@state.choicesName}</span>}
            </div>
            <div className="columns-container" style={marginBottom: '0.2em'}>
              <FileButton className="major-button column" accept=".csv, .tsv" disabled={@checkAdd()} onSelect={@handleFiles.bind this, 'characteristicsName', @addCharacteristics, null}>{if @state.task.characteristicsOrder.length is 0 then "Add" else "Replace"} characteristics</FileButton>
              <TriggeredModalForm trigger={
                <span className="secret-button">
                <i className="fa fa-question-circle"></i>
                </span>
                }>
                {surveyEditorHelp.characteristics}
                </TriggeredModalForm>
              {if @state.characteristicsName?
                <span className="filename">{@state.characteristicsName}</span>}
            </div>
            <div className="columns-container" style={marginBottom: '0.2em'}>
              <FileButton className="major-button column" accept=".csv, .tsv" disabled={@checkAdd()} onSelect={@handleFiles.bind this, 'confusionsName', @addConfusion, null}>{if @checkConfusions() then "Replace" else "Add"} confused pairs</FileButton>
              <TriggeredModalForm trigger={
                <span className="secret-button">
                <i className="fa fa-question-circle"></i>
                </span>
                }>
                {surveyEditorHelp.confusions}
                </TriggeredModalForm>
              {if @state.confusionsName?
                <span className="filename">{@state.confusionsName}</span>}
            </div>
            <div className="columns-container" style={marginBottom: '0.2em'}>
              <FileButton className="major-button column" accept=".csv, .tsv" disabled={@checkAdd()} onSelect={@handleFiles.bind this, 'questionsName', @addQuestion, @cleanQuestions}>{if @state.task.questionsOrder.length is 0 then "Add" else "Replace"} questions</FileButton>
              <TriggeredModalForm trigger={
                <span className="secret-button">
                <i className="fa fa-question-circle"></i>
                </span>
                }>
                {surveyEditorHelp.questions}
                </TriggeredModalForm>
              {if @state.questionsName?
                <span className="filename">{@state.questionsName}</span>}
            </div>
            <hr />
          </div>}
        {if @state.editing is 'images'
          <div className="tab-content">
            <div>
              <span className="form-label">Survey images</span>{' '}
              <AutoSave resource={@props.workflow}>
                <button type="button" disabled={@state.resettingFiles} onClick={@resetMedia}>Delete all</button>
                {if @state.resettingFiles
                  <i className="fa fa-spinner fa-spin"></i>}
              </AutoSave>
            </div>

            <MediaArea
              resource={@props.workflow}
              metadata={prefix: @props.taskPrefix}
              style={maxHeight: '90vh'}
              onAdd={@handleImageAdd}
              onDelete={@handleImageDelete}
            />
          </div>}
        {unless @state.importErrors.length is 0
          <div className="tab-content">
            <p className="form-label">Import errors</p>
            {for {error, file, row}, i in @state.importErrors
              <p key={i}>
                <strong>{error.message}</strong>
                <br />
                <span className="form-help">
                  {if file?
                    <span>{file?.name} </span>}
                  {if row? or error.row?
                    <span>Row {(row ? error.row) + 1} </span>}
                </span>
              </p>}
            <hr />
          </div>}
        {if @state.editing is 'data'
          <div className="tab-content">
            <div className="columns-container">
              <button className="major-button apply" disabled={@checkApply()} onClick={@handleApply.bind(null, @state.task)}>Apply</button>
              <button className="major-button clear" disabled={@checkClear()} onClick={@clearState}>Clear</button>
            </div>
            <hr />
          </div>}
        {unless contentWarnings.length is 0 or @state.task.choicesOrder.length is 0
          characteristicsWarnings = contentWarnings.filter (warning) -> warning.source is 'characteristics'
          confusionsWarnings = contentWarnings.filter (warning) -> warning.source is 'confusions'
          questionsWarnings = contentWarnings.filter (warning) -> warning.source is 'questions'
          imagesChoicesWarnings = contentWarnings.filter (warning) -> warning.source is 'images-choices'
          imagesCharacteristcsWarnings = contentWarnings.filter (warning) -> warning.source is 'images-characteristics'
          <div className="tab-content">
            <p className="form-label">Content warnings</p>
            {unless characteristicsWarnings.length is 0
              <Details key="chars" summary={<strong className="details">Characteristics Warnings ({characteristicsWarnings.length})</strong>}>
                {for {source, message}, i in characteristicsWarnings
                  <p key={"#{source}-#{i}"}>{message}</p>
                }
              </Details>}
            {unless confusionsWarnings.length is 0
              <Details key="confs" summary={<strong className="details">Confusions Warnings ({confusionsWarnings.length})</strong>}>
                {for {source, message}, i in confusionsWarnings
                  <p key={"#{source}-#{i}"}>{message}</p>
                }
              </Details>}
            {unless questionsWarnings.length is 0
              <Details key="ques" summary={<strong className="details">Questions Warnings ({questionsWarnings.length})</strong>}>
                {for {source, message}, i in questionsWarnings
                  <p key={"#{source}-#{i}"}>{message}</p>
                }
              </Details>}
            {unless imagesChoicesWarnings.length is 0
              <Details key="imgChoice" summary={<strong className="details">Images for Choices Warnings ({imagesChoicesWarnings.length})</strong>}>
                {for {source, message}, i in imagesChoicesWarnings
                  <p key={"#{source}-#{i}"}>{message}</p>
                }
              </Details>}
            {unless imagesCharacteristcsWarnings.length is 0
              <Details key="imgChar" summary={<strong className="details">Images for Characteristics Warnings ({imagesCharacteristcsWarnings.length})</strong>}>
                {for {source, message}, i in imagesCharacteristcsWarnings
                  <p key={"#{source}-#{i}"}>{message}</p>
                }
              </Details>}
          </div>}
      </div>

      <hr />

      <p>
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Next task</span>
          <br />
          <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.next" value={@props.task.next ? ''} onChange={handleInputChange.bind @props.workflow} />
        </AutoSave>
      </p>

      <hr />

      <div>
        <span className="form-label">Applied Survey Data</span>{' '}
        <AutoSave resource={@props.workflow}>
          <button type="button" onClick={@resetTask}>Delete all</button>
        </AutoSave>
      </div>

      {for choiceID in @props.task.choicesOrder
        choice = @props.task.choices[choiceID]
        <Details key={choiceID} summary={
          <strong className="details">{choice.label}</strong>
        }>
          <Markdown content={choice.description} />
          <div>
            {if Object.keys(choice.characteristics).length isnt 0
              for characteristicID in @props.task.characteristicsOrder when choice.characteristics[characteristicID]?.length isnt 0
                characteristic = @props.task.characteristics[characteristicID]
                <div key={characteristicID}>
                  <small>
                    {characteristic.label}:{' '}
                    {valueLabels = for valueID in characteristic.valuesOrder when valueID in choice.characteristics[characteristicID]
                      value = characteristic.values[valueID]
                      value.label
                    valueLabels.join ', '}
                  </small>
                </div>}
            {unless choice.confusionsOrder.length is 0
              <div>
                <small>
                  Confused with:{' '}
                  {twinLabels = for twinID in choice.confusionsOrder
                    twin = @props.task.choices[twinID]
                    twin?.label ? '(Unknown choice)'
                  twinLabels.join ', '}
                </small>
              </div>}
          </div>
        </Details>}

      <hr />

      {if @props.task.questionsOrder?.length
        <div>
          <Details summary={<span className="details">Questions</span>}>
            {for questionID in @props.task.questionsOrder
              question = @props.task.questions[questionID]
              <p key={questionID}>
                <strong>{question.label}</strong>:{' '}
                {if question.multiple
                  'Any of'
                else
                  'One of'}{' '}
                {(question.answers[answerID].label for answerID in question.answersOrder).join ', '}{' '}
                {if question.required
                  '(Required)'}
                </p>}
          </Details>
          <hr />
        </div>}

      <Details summary={<small className="details">Raw task data</small>}>
        <pre style={fontSize: '10px', whiteSpace: 'pre-wrap'}>{JSON.stringify @props.task, null, 2}</pre>
      </Details>

      <hr />

      <label>
        <AutoSave resource={@props.workflow}>
          <input type="checkbox" name="#{@props.taskPrefix}.required" checked={@props.task.required} onChange={handleInputChange.bind @props.workflow} />{' '}
          Require at least one identification
        </AutoSave>
      </label>

      <hr />

      <label>
        <AutoSave resource={@props.workflow}>
          <input type="checkbox" name="#{@props.taskPrefix}.alwaysShowThumbnails" checked={@props.task.alwaysShowThumbnails} onChange={handleInputChange.bind @props.workflow} />{' '}
          Always show thumbnails
        </AutoSave>
      </label>
    </div>

  handleImportTabs: (tab) ->
    @setState editing: tab

  handleApply: (newTask) ->
    @props.task.characteristics = newTask.characteristics
    @props.task.characteristicsOrder = newTask.characteristicsOrder
    @props.task.choices = newTask.choices
    @props.task.choicesOrder = newTask.choicesOrder
    @props.task.questions = newTask.questions
    @props.task.questionsMap = newTask.questionsMap
    @props.task.questionsOrder = newTask.questionsOrder

    @props.workflow.update('tasks').save()
      .then =>
        @clearState()

  clearState: ->
    @setState
      task: JSON.parse JSON.stringify @props.task
      choicesName: null
      characteristicsName: null
      confusionsName: null
      questionsName: null
      importErrors: []

  handleFiles: (inputType, forEachRow, afterFileHook, e) ->
    @setState resettingFiles: true

    @clearInputTypeOrder inputType
    @clearInputTypeErrors inputType

    Array::slice.call(e.target.files).forEach (file) =>
      @setState "#{inputType}": file.name
      @readFile file, inputType
        .then (content) =>
          @parseFileContent content, inputType
        .then (rows) =>
          Promise.all rows.map (row, i) =>
            try
              forEachRow row
            catch error
              @handleImportError error, file, inputType, i
        .catch (error) =>
          throw error
          @handleImportError error, file, inputType
        .then =>
          afterFileHook?()
        .then =>
          @handleDeletions inputType
        .then =>
          @setState resettingFiles: false

  readFile: (file, inputType) ->
    new Promise (resolve) ->
      reader = new FileReader
      reader.onload = (e) =>
        resolve e.target.result
      reader.onerror = (error) =>
        @handleImportError error, file, inputType
      reader.readAsText file

  parseFileContent: (content, inputType) ->
    {errors, data} = Papa?.parse content.trim(), header: true, delimiter: ','

    cleanRows = for row in data
      clean = {}
      for key, value of row
        cleanKey = key.trim()
        cleanValue = value.trim?()

        if key.indexOf('=') is -1
          cleanKey = cleanKey.toLowerCase().replace /\s+/g, '_'
        else
          cleanValue = @determineBoolean cleanValue

        clean[cleanKey] = cleanValue
      clean

    for error in errors
      @handleImportError error, inputType

    cleanRows

  determineBoolean: (value) ->
    # TODO: Iterate on this as we see more cases.
    value?.charAt(0).toUpperCase() in ['T', 'X', 'Y', '1']

  makeID: (string) ->
    string.replace(/\W/g, '').toUpperCase()

  createChoice: (name) ->
    choiceID = @makeID name
    unless choiceID in @state.task.choicesOrder
      @state.task.choicesOrder.push choiceID
    @state.task.choices[choiceID] ?=
      label: name
      description: ''
      noQuestions: false
      images: []
      characteristics: {}
      confusionsOrder: []
      confusions: {}
    @state.task.choices[choiceID]

  addChoice: ({name, description, no_questions, images, __parsedExtra}) ->
    unless name?
      throw new Error 'Choices require a "name" column.'
    choice = @createChoice name
    choice.label = name
    if description?
      choice.description = description
    if no_questions?
      choice.noQuestions = @determineBoolean no_questions
    if images?
      images = images.split(/s*;\s*/).concat(__parsedExtra ? []).filter Boolean
      choice.images = images
    @setState choices: true

  checkChoiceLabelMatch: (name) ->
    choiceLabels = []
    for choiceKey, choiceValue of @state.task.choices
      choiceLabels.push choiceValue.label
    noLabelMatch = choiceLabels.some (label, i) =>
      label is name
    unless noLabelMatch
      throw new Error "#{name} does not have a Choices match"

  addCharacteristics: (row) ->
    unless row.name?
      throw new Error 'Characteristics require a "name" column.'
    @checkChoiceLabelMatch(row.name)
    for charKeyVal, isSet of row when charKeyVal isnt 'name'
      [characteristicLabel, valueLabelAndIcon] = charKeyVal.replace('=', '__SPLIT_ONCE__').split /\s*__SPLIT_ONCE__\s*/
      [valueLabel, valueIcon] = valueLabelAndIcon.split /\s*;\s*/
      if characteristicLabel is '' or valueLabel is ''
        throw new Error 'Characteristics column headers should be formatted like "Color=Blue","Color=Red".'
      characteristicID = @makeID characteristicLabel
      valueID = @makeID valueLabel
      unless characteristicID in @state.task.characteristicsOrder
        @state.task.characteristicsOrder.push characteristicID
        @state.task.characteristics[characteristicID] =
          label: ''
          valuesOrder: []
          values: {}
      @state.task.characteristics[characteristicID].label = characteristicLabel
      unless valueID in @state.task.characteristics[characteristicID].valuesOrder
        @state.task.characteristics[characteristicID].valuesOrder.push valueID
        @state.task.characteristics[characteristicID].values[valueID] =
          label: valueLabel
      @state.task.characteristics[characteristicID].values[valueID].image = valueIcon
      for choiceID, choice of @state.task.choices
        choice.characteristics[characteristicID] ?= []
      if isSet
        choiceID = @makeID row.name
        if @state.task.choices[choiceID]?.characteristics[characteristicID].indexOf(valueID) is -1
          @state.task.choices[choiceID]?.characteristics[characteristicID].push valueID

  addConfusion: ({name, twin, details}) ->
    unless name?
      throw new Error 'Confused pairs require a "name" column.'
    unless twin?
      throw new Error 'Confused pairs require a "twin" column.'
    @checkChoiceLabelMatch name
    @checkChoiceLabelMatch twin
    choiceID = @makeID name
    confusionID = @makeID twin
    @state.task.choices[choiceID]?.confusionsOrder.push confusionID
    @state.task.choices[choiceID]?.confusions[confusionID] = details

  addQuestion: ({question, multiple, required, answers, include, exclude, __parsedExtra}) ->
    unless !!question
      throw new Error 'Questions require a "question" column'
    unless !!answers
      throw new Error 'Questions require a "answers" column'

    includeChoices = include.split /\s*;\s*/ if !!include
    excludeChoices = exclude.split /\s*;\s*/ if !!exclude
    questionID = @makeID question

    # don't put it in the default questionsOrder if we've specified choices it should map to
    unless !!includeChoices or !questionID or (questionID in @state.task.questionsOrder)
      qOrder = @maybeProp @state.task, 'questionsOrder', []
      qOrder.push questionID

    # if we specified mapped choices, create those entries instead
    if includeChoices?
      for choice in includeChoices
        @checkChoiceLabelMatch choice
        choiceID = @makeID choice
        continue unless !!choiceID
        (@maybeProp @state.task, 'inclusions', []).push [choiceID, questionID]

    if excludeChoices?
      for choice in excludeChoices
        @checkChoiceLabelMatch choice
        choiceID = @makeID choice
        continue unless !!choiceID
        (@maybeProp @state.task, 'exclusions', []).push [choiceID, questionID]

    @state.task.questions[questionID] =
      label: question
      multiple: @determineBoolean multiple
      required: @determineBoolean required
      answersOrder: []
      answers: {}

    for answer in ((answers.split /;/).concat __parsedExtra ? []).filter Boolean
      answerID = @makeID answer
      @state.task.questions[questionID].answersOrder.push answerID
      @state.task.questions[questionID].answers[answerID] =
        label: answer

  maybeProp: (owner, prop, defVal) ->
    owner[prop] = defVal unless owner[prop]?
    owner[prop]

  cleanQuestions: () ->
    if @state.task.questionsOrder?
      for questionID in @state.task.questionsOrder
        for choiceID in @state.task.choicesOrder
          continue if @state.task.choices[choiceID].noQuestions
          qMap = @maybeProp @state.task, 'questionsMap', {}
          qSet = @maybeProp qMap, choiceID, []
          qSet.push questionID

    if @state.task.inclusions?
      for includeTuple in @state.task.inclusions
        qMap = @maybeProp @state.task, 'questionsMap', {}
        qSet = @maybeProp qMap, includeTuple[0], []
        qSet.push includeTuple[1]

    if @state.task.exclusions?
      for excludeTuple in @state.task.exclusions
        qMap = @maybeProp @state.task, 'questionsMap', {}
        qSet = @maybeProp qMap, excludeTuple[0], []
        index = qSet.indexOf excludeTuple[1]
        qSet.splice index, 1

    delete @state.task.inclusions
    delete @state.task.exclusions

  handleImageAdd: (media) ->
    @setState resettingFiles: true
    @props.task.images[media.metadata.filename] = media.src
    @props.workflow.update('tasks').save()
      .then =>
        @setState resettingFiles: false

  handleImageDelete: (media) ->
    @setState resettingFiles: true
    delete @props.task.images[media.metadata.filename]
    @props.workflow.update('tasks').save()
      .then =>
        @setState resettingFiles: false

  clearInputTypeOrder: (inputType) ->
    task = @state.task
    switch inputType
      when 'choicesName'
        task.choicesOrder = []
      when 'characteristicsName'
        task.characteristicsOrder = []
      when 'confusionsName'
        for choiceKey, choiceValue of task.choices
          choiceValue.confusions = {}
          choiceValue.confusionsOrder = []
      when 'questionsName'
        task.questionsOrder = []
        task.questionsMap = {}
    @setState task: task

  handleDeletions: (inputType) ->
    task = @state.task
    switch inputType
      when 'choicesName'
        for choiceID in @props.task.choicesOrder when choiceID not in task.choicesOrder
          delete task.choices[choiceID]
          delete task.questionsMap[choiceID]
      when 'characteristicsName'
        for characteristicID in @props.task.characteristicsOrder when characteristicID not in task.characteristicsOrder
          delete task.characteristics[characteristicID]
          for choiceKey, choiceValue of task.choices
            delete choiceValue.characteristics[characteristicID]
    @setState task: task

  resetTask: (e) ->
    if e.shiftKey or confirm 'Really delete all the data from this task?'
      Object.assign @props.task,
        characteristicsOrder: []
        characteristics: {}
        choicesOrder: []
        choices: {}
        questionsOrder: []
        questions: {}
        questionsMap: {}
      @props.workflow.update 'tasks'
      @clearState()

  resetMedia: (e) ->
    if e.shiftKey or confirm 'Really delete all the images from this task? This might take a while...'
      @setState resettingFiles: true
      errors = 0
      massDelete = getAllLinked(@props.workflow, 'attached_images').then (workflowImages) =>
        taskImages = workflowImages.filter (image) =>
          image.metadata.prefix is @props.taskPrefix
        Promise.all taskImages.map (image) =>
          image.delete().catch =>
            errors += 1
      massDelete.then =>
        @setState resettingFiles: false
        if errors isnt 0
          alert "There were #{errors} errors deleting all those resources. Try again to get the rest."

  clearInputTypeErrors: (inputType) ->
    importErrors = @state.importErrors
    unless importErrors.length is 0
      newImportErrors = importErrors.filter (error) =>
        return error if error.inputType isnt inputType
      @setState importErrors: newImportErrors

  handleImportError: (error, file, inputType, row) ->
    @state.importErrors.push {error, file, inputType, row}
    @setState importErrors: @state.importErrors

  checkAdd: ->
    if @state.task.choicesOrder.length is 0
      true
    else
      false

  checkConfusions: ->
    confusions = false
    for choiceKey, choiceValue of @state.task.choices
      if choiceValue.confusionsOrder.length isnt 0
        confusions = true
    confusions

  checkClear: ->
    if (@state.choicesName or @state.characteristicsName or @state.confusionsName or @state.questionsName)
      false
    else
      true

  checkApply: ->
    if not @checkClear() and @state.importErrors.length is 0
      false
    else
      true

  checkContentWarnings: ->
    contentWarnings = []

    #characteristics
    if @state.task.characteristicsOrder.length is 0
      contentWarnings.push {source: 'characteristics', message: 'No characteristics added.'}
    else
      for choiceKey, choiceValue of @state.task.choices
        noCharacteristics = true
        for characteristicKey, characteristicValue of choiceValue.characteristics
          unless characteristicValue.length is 0
            noCharacteristics = false
        if noCharacteristics
          contentWarnings.push {source: 'characteristics', message: "#{choiceValue.label} has no characteristics."}

    #confusions
    if @checkConfusions()
      for choiceKey, choiceValue of @state.task.choices when choiceValue.confusionsOrder.length is 0
        contentWarnings.push {source: 'confusions', message: "#{choiceValue.label} has no confusions."}
    else
      contentWarnings.push {source: 'confusions', message: 'No confusions added.'}

    #questions
    if @state.task.questionsOrder.length is 0
      contentWarnings.push {source: 'questions', message: 'No questions added.'}

    #images-choices
    for choiceKey, choiceValue of @state.task.choices
      for image in choiceValue.images when image not in Object.keys(@props.task.images)
        contentWarnings.push {source: 'images-choices', message: "#{choiceValue.label} is missing image #{image}."}

    #images-characteristics
    for characteristicsKey, characteristicsValue of @state.task.characteristics
      for characteristicKey, characteristicValue of characteristicsValue.values when characteristicValue.image not in Object.keys(@props.task.images)
        contentWarnings.push {source: 'images-characteristics', message: "Characteristic #{characteristicsValue.label}, subtype #{characteristicValue.label} is missing #{characteristicValue.image}."}

    contentWarnings
