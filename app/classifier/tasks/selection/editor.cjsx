React = require 'react'
DragReorderable = require 'drag-reorderable'
TriggeredModalForm = require 'modal-form/triggered'

AutoSave = require '../../../components/auto-save'
handleInputChange = require '../../../lib/handle-input-change'
NextTaskSelector = require '../next-task-selector'

module?.exports = React.createClass
  displayName: 'SelectionEditor'

  getDefaultProps: ->
    workflow: {}
    task: {}

  getInitialState: ->
    selectBox: ''

  componentWillMount: ->
    @setDefaultAnswersOrder() if not @props.task.answersOrder.length

  setDefaultAnswersOrder: ->
    @props.task.answersOrder = Object.keys(@props.task.answers)
    @updateTasks()

  updateTasks: ->
    @props.workflow.update('tasks')

  selectedValues: ->
    @props.task.answers[@state.selectBox]?.values

  addAnswer: (answerKey, answer) ->
    if (not answer.title) or (not answerKey)
      return window.alert('Answers must have a Key and Title')

    if Object.keys(@props.task.answers).indexOf(answerKey) isnt -1
      return window.alert('Answer keys must be unique')

    @props.task.answers[answerKey] = answer
    @props.task.answersOrder = @props.task.answersOrder.concat(answerKey)
    @updateTasks()

  addAnswerValue: (answerKey, answer) ->
    if not answer
      return window.alert('Please supply an answer')

    if @selectedValues().indexOf(answer) isnt -1
      return window.alert('Answer values must be unique to each option')

    @props.task.answers[answerKey].values?.push(answer)
    @updateTasks()

  onClickAddAnswer: (e) ->
    @addAnswer(@refs.answerKey.value, {
      title: @refs.answerTitle.value,
      values: []
    })
    @updateTasks()

    @refs.answerKey.value = ''
    @refs.answerTitle.value = ''

  onClickAddAnswerValue: (e) ->
    @addAnswerValue(@refs.selectBox.value, @refs.answerValue.value)
    @refs.answerValue.value = ''

  onClickSaveWorkflow: (e) ->
    if window.confirm('Are you sure that you would like to save these changes?')
      @props.workflow.save()

  onChangeSelectBox: (e) ->
    @setState({selectBox: e.target.value})

  onClickDeleteSelectBox: (e) ->
    if window.confirm('Are you sure that you would like to delete this select box?')
      @props.task.answersOrder = @props.task.answersOrder.filter (answer) => answer isnt @refs.selectBox.value
      delete @props.task.answers[@refs.selectBox.value]

      @setState {selectBox: ''}, =>
        @updateTasks()
        @props.workflow.save()

  onChangeAnswersOrder: (answersOrder) ->
    @props.task.answersOrder = answersOrder
    @updateTasks()

  onClickDeleteSelectOption: (selectItem) ->
    {answers} = @props.task

    if window.confirm('Are you sure that you would like to delete this option?')
      answers[@state.selectBox]?.values = @selectedValues().filter (value) -> value isnt selectItem
      @updateTasks()

  render: ->
    {answers, answersOrder} = @props.task
    answerKeys = Object.keys(answers)

    <div className="selection-editor">
      <div className="selection">

        <section>
          <h2 className="form-label">Select Box Order</h2>

          <DragReorderable
            tag='ol'
            items={answersOrder}
            onChange={@onChangeAnswersOrder}
            render={(name) ->
              <li><i className="fa fa-reorder" title="Drag to reorder" /> {name}</li>
            }
          />
        </section>

        <hr />

        <section>
          <h2 className="form-label">Add a select box</h2>
          <label>
            Answer Key <input ref="answerKey"></input>
          </label>

          <label>
            Title <input ref="answerTitle"></input>
          </label>

          <TriggeredModalForm trigger={<i className="fa fa-question-circle"></i>}>
            <p><strong>Answer Keys</strong> are used as a unique identifier to store data within the classification</p>
            <p><strong>Titles</strong> are what will be displayed as the default option within the select box</p>
          </TriggeredModalForm>

          <button type="button" onClick={@onClickAddAnswer}>+ Add Select Box</button>
        </section>

        <hr/>

        <section>
          <h2 className="form-label">Add an option to a select box</h2>

          <span>Select Box </span>

          <select ref="selectBox" defaultValue={@state.selectBox} onChange={@onChangeSelectBox}>
            <option value="" disabled>Select Box</option>

            {answerKeys.map (answerKey, i) =>
              <option key={answerKey + i} value={answerKey}>{answers[answerKey].title}</option>}
          </select>

          {if @state.selectBox
            <div>
              <ul>
                {@selectedValues().map (value, i) =>
                  <li key={i}>
                    {value}{' '}

                    <button onClick={@onClickDeleteSelectOption.bind(this, value)} title="Delete">
                      <i className="fa fa-close" />
                    </button>
                  </li>}
              </ul>

              <div className="selection-option">
                <label>
                  Value <input ref="answerValue"></input>
                </label>{' '}

                <TriggeredModalForm trigger={<i className="fa fa-question-circle"></i>}>
                  <p><strong>Values</strong> are what will be displayed to users as options within the select box</p>
                </TriggeredModalForm>
              </div>

              <button type="button" onClick={@onClickAddAnswerValue}><i className="fa fa-plus" /> Add Select Box Value</button>
              <button type="button" onClick={@onClickDeleteSelectBox}><i className="fa fa-close" /> Delete Select Box</button>
            </div>
            }
        </section>

        <div><strong>({answerKeys.length}) Available</strong></div>

        <button type="button" onClick={@onClickSaveWorkflow}><i className="fa fa-save" /> Save Workflow</button>
      </div>

      <hr/>

      <AutoSave resource={@props.workflow}>
        <span className="form-label">Next task</span>
        <br />
        <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.next" value={@props.task.next ? ''} onChange={handleInputChange.bind @props.workflow} />
      </AutoSave>
    </div>
