React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'

module.exports = React.createClass
  displayName: 'EditProjectScienceCase'

  getDefaultProps: ->
    project: {}

  fetchOrCreate: ->
    new Promise (resolve, reject) =>
      @props.project.get('pages', url_key: 'science_case').then ([scienceCase]) =>
        if scienceCase?
          resolve(scienceCase)
        else
          params = project_pages: { url_key: "science_case", title: "Science", language: @props.project.primary_langauge }
          apiClient.post(@props.project._getURL("project_pages"), params).then ([scienceCase]) =>
            resolve(scienceCase)

  render: ->
    <div>
      <p className="form-help">This page is for you to describe your research motivations and goals to the volunteers. Feel free to add detail, but try to avoid jargon. This page renders markdown, so you can format it and add images via the Media Library and links. The site will show your team members with their profile pictures and roles to the side of the text.</p>
      <p>
        <PromiseRenderer promise={@fetchOrCreate()}>{ (scienceCase) ->
          <AutoSave resource={scienceCase}>
            <span className="form-label">Science case</span>
            <br />
            <textarea className="standard-input full" name="science_case" value={@props.project.science_case} rows="20" onChange={handleInputChange.bind @props.project} />
          </AutoSave>
        }</PromiseRenderer>
      </p>
    </div>
