module.exports = (workflow) ->
  if workflow.configuration?.multi_image_mode
    workflow.configuration?.multi_image_mode is 'separate' or workflow.configuration?.multi_image_mode is 'flipbook_and_separate'
  else
    false
