module.exports =
  combo: require './combo'
  single: require './single'
  multiple: require './multiple'
  drawing: require './drawing'
  survey: require './survey'
  flexibleSurvey: require './flexible-survey'
  crop: require './crop'
  text: require './text'

window?._tasks = module.exports
