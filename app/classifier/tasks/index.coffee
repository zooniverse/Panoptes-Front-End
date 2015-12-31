module.exports =
  single: require './single'
  multiple: require './multiple'
  drawing: require './drawing'
  survey: require './survey'
  flexibleSurvey: require './flexible-survey'
  crop: require './crop'
  text: require './text'
  selection: require './selection'

window?._tasks = module.exports
