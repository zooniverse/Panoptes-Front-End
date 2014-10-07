# @cjsx React.DOM

React = require 'react'
MarkdownEditor = require '../components/markdown-editor'
Link = require '../lib/link'
Route = require '../lib/route'

module.exports = React.createClass
  displayName: 'EditProjectPage'

  render: ->
    TODO_PROJECT_NAME = 'Galaxy%20Zoo'
    <div>
      <div className="content-container">
        <h1>Project settings</h1>
      </div>

      <div className="tabbed-content" data-side="top">
        <nav className="tabbed-content-tabs">
          <Link href="/build/#{TODO_PROJECT_NAME}" root={true} className="tabbed-content-tab">General</Link>
          <Link href="/build/#{TODO_PROJECT_NAME}/science-case" className="tabbed-content-tab">Science case</Link>
          <Link href="/build/#{TODO_PROJECT_NAME}/subjects" className="tabbed-content-tab">Subjects</Link>
          <Link href="/build/#{TODO_PROJECT_NAME}/workflows" className="tabbed-content-tab">Workflows</Link>
          <Link href="/build/#{TODO_PROJECT_NAME}/roles" className="tabbed-content-tab">User roles</Link>
          <Link href="/build/#{TODO_PROJECT_NAME}/admin" className="tabbed-content-tab">Admin</Link>
        </nav>

        <Route path="/build/#{TODO_PROJECT_NAME}" className="content-container">
          <div className="columns-container">
            <div>
              <div>Avatar</div>
              <img src="//placehold.it/64.png" />
              <input type="file" />
            </div>

            <div>
              <div>
                <label>
                  <div>Title</div>
                  <h2><input type="text" defaultValue="Galaxy Zoo" className="full" /></h2>
                </label>
              </div>

              <div>
                <label>
                  <div>Tag line</div>
                  <input type="text" defaultValue="Help further our understanding of galaxy formation." className="full" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label>
              <div>Introductory text</div>
              <MarkdownEditor rows="10" className="full" />
            </label>
          </div>
        </Route>

        <Route path="/build/#{TODO_PROJECT_NAME}/science-case" className="content-container">
          <MarkdownEditor className="full" />
        </Route>

        <Route path="/build/#{TODO_PROJECT_NAME}/subjects">
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
        </Route>

        <Route path="/build/#{TODO_PROJECT_NAME}/workflows">
          <p>workflows</p>
        </Route>
        <Route path="/build/#{TODO_PROJECT_NAME}/roles">
          <p>roles</p>
        </Route>
        <Route path="/build/#{TODO_PROJECT_NAME}/admin">
          <p>admin</p>
        </Route>
      </div>
    </div>
