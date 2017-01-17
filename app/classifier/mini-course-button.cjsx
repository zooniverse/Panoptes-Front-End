React = require 'react'
MiniCourse = require '../lib/mini-course'

module.exports = (props) ->
    if props.minicourse?.steps.length > 0 and props.user?
      <button type="button" className={props.className} style={props.style} onClick={MiniCourse.restart.bind(MiniCourse, props.minicourse, props.preferences, props.project, props.user)}>
        {@props.children}
      </button>
    else
      null