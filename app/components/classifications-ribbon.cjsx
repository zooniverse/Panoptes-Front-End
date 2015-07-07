React = require 'react'

module.exports = React.createClass
  getDefaultProps: ->
    projects: for i in [0...20]
      {project: "Project #{i}", classifications: Math.floor Math.random() * 100}
    cutoff: 1 / 50
    width: '20em'
    height: '1em'

  getProjectColor: (name) ->
    characters = name.split ''
    code = [0, characters...].reduce (code, character) ->
      return code + character.charCodeAt 0
    # Square the number so that e.g. "a" and "b" aren't so close.
    hue = Math.pow(code, 2) % 360
    "hsl(#{hue}, 100%, 50%)"

  render: ->
    if @props.projects.length is 0
      <span className="user-classifications-ribbon-empty">No classifications yet</span>

    else
      totalClassifications = 0
      for {classifications} in @props.projects
        totalClassifications += classifications

      others = []

      lastX = 0
      <svg className="user-classifications-ribbon" width={@props.width} height={@props.height} viewBox="0 0 1 1" preserveAspectRatio="none">
        {for {project, classifications}, i in @props.projects
          width = classifications / totalClassifications
          if width < @props.cutoff
            others.push {project, classifications}
            continue
          else
            band = <rect key={project} fill={@getProjectColor project} stroke="none" x={lastX} y="0" width={width} height="1">
              <title>
                {project}: {classifications}
              </title>
            </rect>
            lastX += width
            band}

        {unless others.length is 0
          othersWidth =
          <rect fill="gray" fillOpacity="0.5" stroke="none" x={lastX} y="0" width="1" height="1">
            <title>
              {("#{project}: #{classifications}" for {project, classifications} in others).join '\n'}
            </title>
          </rect>}
      </svg>
