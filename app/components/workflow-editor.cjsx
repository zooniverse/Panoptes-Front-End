React = require 'react'

AnswerEditor = React.createClass
  displayName: 'AnswerEditor'

  render: ->
    <div className="answer">
      <div className="controls">
        <button type="button" className="delete-answer">&times;</button>
      </div>

      <label>
        <span className="field-label">Label</span>
        <br />
        <textarea rows="1" style={width: '100%'}></textarea>
      </label>
      <br />

      <div className="answer-properties">
        <label>
          Next task <select>
            <option>(Default)</option>
          </select>
        </label>
      </div>
    </div>

QuestionTaskEditor = React.createClass
  displayName: 'QuestionTaskEditor'

  render: ->
    <div className="task">
      <div className="controls">
        <button type="button" className="delete-task">&times;</button>
      </div>

      <label>
        <span className="field-label">Question</span>
        <br />
        <textarea rows="2" style={width: '100%'}></textarea>
      </label>
      <br />

      <span className="field-label">Answers</span>
      <label className="inline-input"><input type="checkbox" /> Multiple choice</label>
      <br />

      <div className="answers-list">
        <AnswerEditor />

        <div className="adder-container">
          <button type="button" className="adder">Add a new answer</button>
        </div>
      </div>
    </div>

FeatureEditor = React.createClass
  displayName: 'FeatureEditor'

  render: ->
    <div className="answer">
      <div className="controls">
        <button type="button" className="delete-answer">&times;</button>
      </div>

      <label>
        <span className="field-label">Label</span>
        <br />
        <textarea rows="1" style={width: '100%'}></textarea>
      </label>
      <br />

      <div className="answer-properties">
        <label>
          Shape <select>
            <option>Point</option>
          </select>
        </label>

        <label>
          Color <select>
            <option>(Default)</option>
          </select>
        </label>
      </div>
    </div>

MarkingTaskEditor = React.createClass

  render: ->
    <div className="task">
      <div className="controls">
        <button type="button">&times;</button>
      </div>

      <label>
        <span className="field-label">Instruction</span>
        <br />
        <textarea rows="2" style={width: '100%'}></textarea>
      </label>
      <br />

      <span className="field-label">Features to mark</span>
      <br />
      <div className="answers-list">
        <FeatureEditor />

        <div className="adder-container">
          <button type="button" className="adder">Add a new feature</button>
        </div>
      </div>
    </div>

module.exports = React.createClass
  displayName: 'WorkflowEditor'

  render: ->
    <div className="workflow-editor" style={margin: '1em'}>
      <label>
        <span className="field-label">Name</span>
        <br />
        <input type="text" style={width: '100%'} />
      </label>
      <hr />

      <span className="field-label">Tasks</span>
      <br />
      <div className="task-list">
        <QuestionTaskEditor />
        <MarkingTaskEditor />
      </div>

      Add a new task:<br />
      <div className="adder-container">
        <button type="button" className="adder">Question</button>
        <button type="button" className="adder">Marking</button>
        <button type="button" className="adder" disabled>Image survey</button>
      </div>
    </div>
