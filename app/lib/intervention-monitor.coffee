# Monitors interventions coming via Sugar, for example from Experiment Server, throughout the app

{sugarClient} = require 'panoptes-client/lib/sugar'
EventEmitter = require 'events'

DEBUG = false

# for detecting interventions that have been posted via Sugar (e.g. by the Experiment Server)
class InterventionMonitor extends EventEmitter
  project_slug: null

  constructor: ->
    @startListening()

  latestFromSugar: null

  setProjectSlug: (project_slug) ->
    @project_slug = project_slug

  clearSugarLatest: ->
    @latestFromSugar = null
    
  shouldShowIntervention: ->
    return (@latestFromSugar? and @latestFromSugar["intervention_time"] and @latestFromSugar["next_event"] and @latestFromSugar["active"])

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
      if @latestFromSugar["active"]==true
        if @latestFromSugar["intervention_time"]==true
          if DEBUG then console.log "Sugar reports that an intervention is required:\n",@latestFromSugar
          this.emit 'interventionRequested', @latestFromSugar
        else
          if DEBUG then console.log "Update from Sugar - no intervention required though:\n",@latestFromSugar
          this.emit 'classificationTaskRequested', @latestFromSugar
      else
        if DEBUG then console.log "Sugar's experimental data ignored as participant is marked inactive:\n",@latestFromSugar

module.exports = new InterventionMonitor