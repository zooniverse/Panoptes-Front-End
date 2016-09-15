module.exports = (workflow) ->
  if workflow.configuration?.multi_image_mode
    workflow.configuration?.multi_image_mode is 'flipbook'
  else
    true
