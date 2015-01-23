React = require 'react'
JSONEditor = require '../../components/json-editor'
data = require './data'
{Link} = require 'react-router'

DEFAULT_TASKS =
  is_cool:
    type: 'single'
    question: 'Is this thing cool?'
    answers: [
      {value: true, label: 'Yeah!'}
      {value: false, label: 'Nope!'}
    ]
    next: null

module.exports = React.createClass
  displayName: 'NewProjectWorkflowPage'

  render: ->
    <div className="content-container">
      <h2>Define the classification workflow</h2>
      <p>Now you’ll define and link together the tasks each volunteer will do to complete a classification. <small>TODO: This is done in raw JSON for now.</small></p>
      <p className="form-help">Each task object gets a <code>type</code> of <code>single</code> or <code>multiple</code>, a <code>question</code> string, and an <code>answers</code> array. Each answer object gets a <code>value</code> and a <code>label</code>. TODO: describe type <code>drawing</code>.</p>
      <JSONEditor name="tasks" placeholder={JSON.stringify DEFAULT_TASKS, null, 2} value={data.tasks} onChange={data.handleInputChange.bind data} rows={20} cols={80} />
      <Link to="new-project-review">Next, review these details and create your project! <i className="fa fa-arrow-right"></i></Link>
    </div>
