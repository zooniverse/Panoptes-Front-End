module.exports = (section) ->

  # returns the project_id of a project talk section,
  # or 'zooniverse' if section is zooniverse global talk

  # zooniverse global talk
  return section if section is 'zooniverse'

  # project talk
  splitSection = section.split('project-')
  splitSection[1..(splitSection.length-1)].join('project-')
