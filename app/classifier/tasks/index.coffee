module.exports =
  single: require './single'
  multiple: require './multiple'
  drawing: require './drawing'
  survey: require './survey'
  crop: require './crop'
  text: require './text'

window?._tasks = module.exports
