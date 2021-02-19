React = require 'react'
createReactClass = require 'create-react-class'
ChangeListener = require '../../components/change-listener'
AutoSave = require '../../components/auto-save'
handleInputChange = require('../../lib/handle-input-change').default
drawingTools = require '../drawing-tools'
alert = require('../../lib/alert').default
DrawingTaskDetailsEditor = require './drawing-task-details-editor'
NextTaskSelector = require './next-task-selector'
{MarkdownEditor, MarkdownHelp} = require 'markdownz'
isAdmin = require '../../lib/is-admin'

# `import MinMaxEditor from './drawing/min-max-editor';`
MinMaxEditor = require('./drawing/min-max-editor').default
GridEditor = require('./drawing/grid-editor').default

module.exports = createReactClass
  displayName: 'GenericTaskEditor'

  getDefaultProps: ->
    workflow: null
    task: null
    taskPrefix: ''

  render: ->
    handleChange = handleInputChange.bind @props.workflow

    [mainTextKey, choicesKey] = switch @props.task.type
      when 'single', 'multiple' then ['question', 'answers']
      when 'drawing' then ['instruction', 'tools']
      when 'crop' then ['instruction']
      when 'text' then ['instruction']
      when 'slider' then ['instruction']
      when 'highlighter' then ['instruction', 'highlighterLabels']

    isAQuestion = @props.task.type in ['single', 'multiple']
    canBeRequired = @props.task.type in ['single', 'multiple', 'text']

    <div className="workflow-task-editor #{@props.task.type}">
      <div>
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Main text</span>
          <br />
          <textarea name="#{@props.taskPrefix}.#{mainTextKey}" value={@props.task[mainTextKey]} className="standard-input full" onChange={handleChange} />
        </AutoSave>
        <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small><br />
      </div>
      <br />

      {unless @props.isSubtask
        <div>
          <AutoSave resource={@props.workflow}>
            <span className="form-label">Help text</span>
            <br />
            <MarkdownEditor name="#{@props.taskPrefix}.help" onHelp={-> alert <MarkdownHelp/>} value={@props.task.help ? ""} rows="7" className="full" onChange={handleChange} />
          </AutoSave>
          <small className="form-help">Add text and images for a window that pops up when volunteers click “Need some help?” You can use markdown to format this text and add images. The help text can be as long as you need, but you should try to keep it simple and avoid jargon.</small>
        </div>}

      {if choicesKey?
        <div>
          <hr />
          <span className="form-label">Choices</span>
        </div>}
      {' '}

      <label className="pill-button">
        <AutoSave resource={@props.workflow}>
          <input type="checkbox" checked={@props.task.enableHidePrevMarks} onChange={@toggleHidePrevMarksEnabled} />{' '}
          Allow hiding marks
        </AutoSave>
      </label>

      {if isAQuestion
        multipleHelp = 'Multiple Choice: Check this box if more than one answer can be selected.'

        <span>
          <label className="pill-button" title={multipleHelp}>
            <AutoSave resource={@props.workflow}>
              <input type="checkbox" checked={@props.task.type is 'multiple'} onChange={@toggleMultipleChoice} />{' '}
              Allow multiple
            </AutoSave>
          </label>
          {' '}
        </span>}

      {if canBeRequired
        requiredHelp = 'Check this box if this question has to be answered before proceeding. If a marking task is Required, the volunteer will not be able to move on until they have made at least 1 mark.'
        <span>
          <label className="pill-button" title={requiredHelp}>
            <AutoSave resource={@props.workflow}>
              <input type="checkbox" name="#{@props.taskPrefix}.required" checked={@props.task.required} onChange={handleChange} />{' '}
              Required
            </AutoSave>
          </label>
          {' '}
        </span>}
      <br />

      {if choicesKey?
        <div className="workflow-task-editor-choices">
          {if (@props.task[choicesKey]?.length ? 0) is 0 # Work around the empty-array-becomes-null bug on the back end.
            <span className="form-help">No <code>{choicesKey}</code> defined for this task.</span>}
          {for choice, index in @props.task[choicesKey] ? []
            choice._key ?= Math.random()
            <div key={choice._key} className="workflow-choice-editor">
              <AutoSave resource={@props.workflow}>
                <textarea name="#{@props.taskPrefix}.#{choicesKey}.#{index}.label" className="standard-input full" value={choice.label} onChange={handleChange} />
              </AutoSave>

              <div className="workflow-choice-settings">
                {switch @props.task.type
                  when 'single'
                    unless @props.isSubtask
                      <div className="workflow-choice-setting">
                        <AutoSave resource={@props.workflow}>
                          Next task{' '}
                          <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.#{choicesKey}.#{index}.next" value={choice.next ? ''} onChange={handleChange} />
                        </AutoSave>
                      </div>

                  when 'highlighter'
                    <div className="workflow-choice-setting" >
                      <AutoSave resource={@props.workflow} >
                        Color{' '}
                        <select style={{background: choice.color}} name="#{@props.taskPrefix}.#{choicesKey}.#{index}.color" value={choice.color} onChange={handleChange}>
                          <option style={{background: "#ff6639"}} value="#ff6639">Red</option>
                          <option style={{background: "#ffa539"}} value="#ffa539">Orange</option>
                          <option style={{background: "#F5D76E"}} value="#F5D76E">Yellow</option>
                          <option style={{background: "#FC6399"}} value="#FC6399">Pink</option>
                          <option style={{background: "#C9F227"}} value="#C9F227">Yellow Green</option>
                          <option style={{background: "#35D056"}} value="#35D056">Green</option>
                          <option style={{background: "#00FF7F"}} value="#00FF7F">Seafoam</option>
                          <option style={{background: "#57c4f7"}} value="#57c4f7">Blue</option>
                          <option style={{background: "#DCC6E0"}} value="#DCC6E0">Light Purple</option>
                          <option style={{background: "#BAC1ff"}} value="#BAC1ff">Violet</option>
                          <option style={{background: "#00ffff"}} value="#00ffff">Cyan</option>
                        </select>
                      </AutoSave>
                    </div>

                  when 'drawing'
                    options = drawingTools[choice.type].options ? []
                    [<div key="type" className="workflow-choice-setting">
                      <AutoSave resource={@props.workflow}>
                        Type{' '}
                        <select name="#{@props.taskPrefix}.#{choicesKey}.#{index}.type" value={choice.type} onChange={handleChange}>
                          {for toolKey of drawingTools
                            <option key={toolKey} value={toolKey}>{toolKey}</option> unless toolKey in ["grid", "freehandLine", "freehandShape", "freehandSegmentLine", "freehandSegmentShape", "anchoredEllipse", "fan", "transcriptionLine"]}
                          {if @canUse("grid")
                            <option key="grid" value="grid">grid</option>}
                          {if @canUse("freehandLine")
                            <option key="freehandLine" value="freehandLine">freehand line</option>}
                          {if @canUse("freehandShape")
                            <option key="freehandShape" value="freehandShape">freehand shape</option>}
                          {if @canUse("freehandSegmentLine")
                            <option key="freehandSegmentLine" value="freehandSegmentLine">freehand segment line</option>}
                          {if @canUse("freehandSegmentShape")
                            <option key="freehandSegmentShape" value="freehandSegmentShape">freehand segment shape</option>}
                          {if @canUse("anchoredEllipse")
                            <option key="anchoredEllipse" value="anchoredEllipse">anchored ellipse</option>}
                          {if @canUse("fan")
                            <option key="fan" value="fan">fan tool</option>}
                          {if isAdmin()
                            <option key="transcriptionLine" value="transcriptionLine">transcription line</option>}
                        </select>
                      </AutoSave>
                    </div>

                    <div key="color" className="workflow-choice-setting">
                      <AutoSave resource={@props.workflow}>
                        Color{' '}
                        <select name="#{@props.taskPrefix}.#{choicesKey}.#{index}.color" value={choice.color} onChange={handleChange}>
                          <option value="#ff0000">Red</option>
                          <option value="#ffff00">Yellow</option>
                          <option value="#00ff00">Green</option>
                          <option value="#00ffff">Cyan</option>
                          <option value="#0000ff">Blue</option>
                          <option value="#ff00ff">Magenta</option>
                          <option value="#000000">Black</option>
                          <option value="#ffffff">White</option>
                        </select>
                      </AutoSave>
                    </div>

                    <MinMaxEditor
                      key='min-max'
                      workflow={@props.workflow}
                      name="#{@props.taskPrefix}.#{choicesKey}.#{index}"
                      choice={choice}
                    />

                    if 'size' in options
                      <div key="size" className="workflow-choice-setting">
                        <AutoSave resource={@props.workflow}>
                          <label>Size{' '}
                            <select
                            name="#{@props.taskPrefix}.#{choicesKey}.#{index}.size"
                            value={choice.size}
                            onChange={handleChange}
                            >
                              <option value="large">Large</option>
                              <option value="small">Small</option>
                            </select>
                          </label>
                        </AutoSave>
                      </div>
                    else
                      null
                    if 'grid' in options
                      <GridEditor
                        key="gridoptions"
                        workflow={@props.workflow}
                        name="#{@props.taskPrefix}.#{choicesKey}.#{index}"
                        choice={choice}
                      />
                    else
                      null

                    <div key="details" className="workflow-choice-setting">
                      <button type="button" onClick={@editToolDetails.bind this, @props.task, index}>Sub-tasks ({choice.details?.length ? 0})</button>{' '}
                      <small className="form-help">Ask users a question about what they’ve just drawn.</small>
                    </div>]}
              </div>

              <AutoSave resource={@props.workflow}>
                <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={@removeChoice.bind this, choicesKey, index}>&times;</button>
              </AutoSave>
            </div>}

          <AutoSave resource={@props.workflow}>
            <button type="button" className="workflow-choice-add-button" title="Add choice" onClick={@addChoice.bind this, choicesKey}>+</button>
          </AutoSave>
          <br />

          {switch choicesKey
            when 'answers'
              <div>
                <small className="form-help">The answers will be displayed next to each checkbox, so this text is as important as the main text and help text for guiding the volunteers. Keep your answers as minimal as possible -- any more than 5 answers can discourage new users.</small><br />
                <small className="form-help">The “Next task” selection describes what task you want the volunteer to perform next after they give a particular answer. You can choose from among the tasks you’ve already defined. If you want to link a task to another you haven’t built yet, you can come back and do it later (don’t forget to save your changes).</small>
              </div>
            when 'highlighterLabels'
              <div>
                <small className="form-help"> Add labels for the highlighter tool.</small>
              </div>
            when 'tools'
              <div>
                <small className="form-help">Select which marks you want for this task, and what to call each of them. The tool name will be displayed on the classification page next to each marking option. Use the simplest tool that will give you the results you need for your research.</small><br />
                <small className="form-help"><b>bezier:</b> an arbitrary shape made of point-to-point curves. The midpoint of each segment drawn can be dragged to adjust the curvature. </small><br />
                <small className="form-help"><b>circle:</b> a point and a radius.</small><br />
                <small className="form-help"><b>column:</b> a box with full height but variable width; this tool <i>cannot</i> be rotated.</small><br />
                <small className="form-help"><b>ellipse:</b> an oval of any size and axis ratio; this tool <i>can</i> be rotated.</small><br />
                <small className="form-help"><b>line:</b> a straight line at any angle.</small><br />
                <small className="form-help"><b>point:</b> X marks the spot.</small><br />
                <small className="form-help"><b>polygon:</b> an arbitrary shape made of point-to-point lines.</small><br />
                <small className="form-help"><b>rectangle:</b> a box of any size and length-width ratio; this tool <i>cannot</i> be rotated.</small><br />
                <small className="form-help"><b>triangle:</b> an equilateral triangle of any size and vertex distance from the center; this tool <i>can</i> be rotated.</small><br />
                {if @canUse("grid")
                  <small className="form-help"><b>grid table</b>: cells which can be made into a table for consecutive annotations.</small>}
                {if @canUse("anchoredEllipse")
                  <small className="form-help"><b>anchored ellipse</b>: creates an ellipes in the center of the subject during the first click, and does not allow it to be dragged.</small>}}
              </div>}
        </div>}

      {unless @props.task.type is 'single' or @props.isSubtask
        <div>
          <AutoSave resource={@props.workflow}>
            Next task{' '}
            <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.next" value={@props.task.next ? ''} onChange={handleChange} />
          </AutoSave>
        </div>}
    </div>

  canUse: (tool) ->
    tool in @props.project.experimental_tools

  toggleHidePrevMarksEnabled: (e) ->
    enableHidePrevMarks = e.target.checked
    @props.task.enableHidePrevMarks = enableHidePrevMarks
    @props.workflow.update 'tasks'

  toggleMultipleChoice: (e) ->
    newType = if e.target.checked
      'multiple'
    else
      'single'
    @props.task.type = newType
    @props.workflow.update 'tasks'

  addChoice: (type) ->
    switch type
      when 'answers' then @addAnswer()
      when 'tools' then @addTool()
      when 'highlighterLabels' then @addHighlighterLabels()

  addAnswer: ->
    @props.task.answers.push
      label: 'Enter an answer'
    @props.workflow.update 'tasks'

  addHighlighterLabels: ->
    @props.task.highlighterLabels.push
      label: 'Enter label'
    @props.workflow.update 'tasks'

  addTool: ->
    @props.task.tools.push
      type: 'point'
      label: 'Tool name'
      color: '#00ff00'
      details: []
    @props.workflow.update 'tasks'

  editToolDetails: (task, toolIndex) ->
    @props.task.tools[toolIndex].details ?= []

    alert (resolve) =>
      <ChangeListener target={@props.workflow}>{=>
        <DrawingTaskDetailsEditor
          project={@props.project}
          workflow={@props.workflow}
          task={@props.task}
          toolIndex={toolIndex}
          details={@props.task.tools[toolIndex].details}
          toolPath="#{@props.taskPrefix}.tools.#{toolIndex}"
          onClose={resolve}
        />
      }</ChangeListener>

  removeChoice: (choicesName, index) ->
    @props.task[choicesName].splice index, 1
    @props.workflow.update 'tasks'
