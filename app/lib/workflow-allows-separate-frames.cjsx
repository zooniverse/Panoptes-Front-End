module.exports = (workflow) ->
  workflow.configuration?.multi_image_mode is 'separate' or workflow.configuration?.multi_image_mode is 'flipbook_and_separate'
