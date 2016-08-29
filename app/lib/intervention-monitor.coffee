{sugarClient} = require 'panoptes-client/lib/sugar'

# for detecting interventions that have been posted via Sugar (e.g. by the Experiment Server)
class InterventionMonitor

  constructor: ->
    @startListening()

  latestFromSugar: null

  startListening: ->
    sugarClient.on 'experiment', @sugarListener

  stopListening: ->
    sugarClient.off 'experiment', @sugarListener

  sugarListener: (sugarMessage) =>
    sugarPayload = sugarMessage.data
    @latestFromSugar = sugarPayload.message
    console.log "received intervention via sugar:",@latestFromSugar

module.exports = InterventionMonitor