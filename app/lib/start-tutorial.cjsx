Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'

module.exports = (project) ->
  steps = project.configuration.tutorial ? []

  Dialog.alert <StepThrough className="tutorial-steps">
    {for step, i in steps
      <MediaCard className="tutorial-step" src={step.media}>
        <Markdown>{step.content}</Markdown>

        {if i is steps.length - 1
          [
            <hr key="hr" />
            <p key="p" style={
              textAlign: 'center'
            }>
              <button type="submit" className="major-button">Let’s go!</button>
            </p>
          ]}
      </MediaCard>}
  </StepThrough>,
  className: 'tutorial-dialog'
