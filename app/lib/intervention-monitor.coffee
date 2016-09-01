{sugarClient} = require 'panoptes-client/lib/sugar'

# for detecting interventions that have been posted via Sugar (e.g. by the Experiment Server)
class InterventionMonitor
  project_slug: null

  constructor: ->
    @startListening()

  latestFromSugar: null

  setProjectSlug: (project_slug) ->
    @project_slug = project_slug

  shouldShowIntervention: ->
    return (@latestFromSugar? and "next_event" of @latestFromSugar and @latestFromSugar["next_event"] != "classification")

  startListening: ->
    sugarClient.on 'experiment', @sugarListener

  stopListening: ->
    sugarClient.off 'experiment', @sugarListener

  sugarListener: (sugarMessage) =>
    sugarPayload = sugarMessage.data
    intervention_target_project = sugarPayload.section
    # intervention only valid if it's for the right project
    if @project_slug? and intervention_target_project == @project_slug
      @latestFromSugar = sugarPayload.message
#     console.log "Received intervention via Sugar:\n",@latestFromSugar

module.exports = InterventionMonitor