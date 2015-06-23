React = require 'react'
projectSection = require '../lib/project-section'

module.exports = (project) ->
  if project?.id
    projectSection(project)
  else
    'zooniverse'
