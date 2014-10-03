# @cjsx React.DOM

React = require 'react'
MarkdownEditor = require '../components/markdown-editor'
Link = require '../lib/link'

module.exports = React.createClass
  displayName: 'EditProjectPage'

  render: ->
    <div>
      <div className="content-container">
        <label>
          <div>Title</div>
          <input type="text" defaultValue="Galaxy Zoo" />
        </label>

        <label>
          <div>Tag line</div>
          <input type="text" defaultValue="Help further our understanding of galaxy formation." />
        </label>

        <label>
          <div>Introductory text</div>
          <MarkdownEditor rows="10" cols="80" />
        </label>

        <label>
          <div>Science case</div>
          <textarea></textarea>
        </label>

        <div>Subjects</div>
        <table>
          <tr>
            <th>ID</th>
            <th>File name</th>
            <th>Time stamp</th>
            <th>Coords</th>
            <th>Controls</th>
          </tr>
          {for i in [0...10]
            <tr key={i}>
              <td>{Math.random().toString(16).split('.')[1]}</td>
              <td>{(new Date i*999).toString()}.jpg</td>
              <td>{(new Date).toISOString()}</td>
              <td>-87.4, 13.77</td>
              <td>
                <Link href="#"><i className="fa fa-pencil" title="Edit"></i></Link>
                &ensp;
                <Link href="#"><i className="fa fa-ban" title="Disable"></i></Link>
              </td>
            </tr>}
        </table>
      </div>
    </div>
