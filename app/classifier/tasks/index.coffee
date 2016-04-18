module.exports =
  combo: require './combo'
  single: require './single'
  multiple: require './multiple'
  drawing: require './drawing'
  survey: require './survey'
  flexibleSurvey: require './survey'
  crop: require './crop'
  text: require './text'
  dropdown: require './dropdown'

window?._tasks = module.exports
