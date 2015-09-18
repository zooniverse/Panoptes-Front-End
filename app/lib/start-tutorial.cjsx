Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'

module.exports = (project) ->
  console.log config: project.configuration
  Dialog.alert <StepThrough className="tutorial-steps">
    {for step in project.configuration.tutorial ? []
      console.log {step}
      <MediaCard src={step.media}>
        <Markdown>{step.content}</Markdown>
      </MediaCard>}
  </StepThrough>,
  className: 'tutorial-dialog'
