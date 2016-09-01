React = require 'react'
InterventionMonitor = require './intervention-monitor'

Intervention = React.createClass

  CLASSIFICATION_MARKER: "classification"

  PROJECT_SLUGS: {
    COMET_HUNTERS: "mschwamb/comet-hunters"
  }

  INTERVENTION_DETAILS: {
    "mschwamb/comet-hunters": {
      CometHuntersVolcroweExperiment1: {
        "valued-statement-1": { body: "On average, we receive a total of A classifications on this project every day." } # TODO Calculate A
        "valued-statement-2": { body: "To date, you have classified a total of B images. The average contributor to this project has classified a total of C images." } # TODO Calculate C, and B if possible (Omit first sentence if not)
        "valued-statement-3": { body: "Your total number of classifications for this project represents D% of the total number received to date." } #TODO Calculate D, or use alternative "Your input is extremely valuable to the project. Thanks very much, please keep going!"
        "valued-statement-4": { body: "On average, this project receives classifications from E individual contributors every week." }
        "valued-statement-5": { body: "Submitting a few more classifications will make a huge difference to the outcome of this project. Thanks very much, please keep going!" }
        "gamisation-statement-1": { body: "Some users as they classify on this project have fun by sharing images of comets that look like other things on Talk." } # TODO Add links.
        "gamisation-statement-2": { body: "Remember, the data you contribute to this project is used to advance scientific knowledge.  Please take your time and make sure you contribute your best possible guess." } # TODO Add links.
        "gamisation-statement-3": { body: "We hope you enjoy looking at these images; scientific research should be fun." }
        "gamisation-statement-4": { body: "If you’re starting to feel bored with this project and would like a break, why not contribute some classifications to [another Zooniverse project]?" } # TODO Add specific links to other projects, with text, at random, with tracking
        "gamisation-statement-5": { body: "You’ve completed quite a lot of classifications in this session.  Why not take a break if you feel you need one?" } # TODO Replace this with backup statement from Joe.
        "learning-statement-1": { body: "Asteroids are small rocky bodies left over from the construction zones that  the planets in our Solar System formed from." }
        "learning-statement-2": { body: "The asteroids you review on Comet Hunters orbit between Mars and Jupiter roughly at 2-5 times the distance between the Earth the Sun." }
        "learning-statement-3": { body: "Freshly exposed buried water ice is thought to drive the activity on main-belt comets. This might mean that main-belt comets helped deliver water to the young Earth." }
        "learning-statement-4": { body: "During an outburst, dust and dirt are ejected off the surface of the asteroid. Sunlight then pushes these small particles into long streaks and complex shapes that we call a main-belt comet's tail." }
        "learning-statement-5": { body: "Main-belt comets are a new class of minor planets recently discovered in our Solar System. Less than 20 have been discovered to date." }
        "valued-question-1": { body: "How do you know that you are making a valuable contribution to this project?" }
        "valued-question-2": { body: "How much money do you think you should receive for each of your classifications if you were being paid to participate in this project?" }
        "valued-question-3": { body: "How would you feel if we told you that you've contributed more classifications today than most other users do in a day?" }
        "valued-question-4": { body: "How many other users do you think have contributed to this project today?" }
        "valued-question-5": { body: "How would you feel if we told you that your classifications are usually more accurate than the average user?" }
        "gamisation-question-1": { body: "Does this feel like a game? Explain why or how it does/doesn't feel like one." }
        "gamisation-question-2": { body: "To what extent do you think you would classify more images if you won things or were thanked or rewarded?" }
        "gamisation-question-3": { body: "When you’re classifying, what sort of things put you off or make you bored?" }
        "gamisation-question-4": { body: "What do you think about the amount of time it takes to complete one classification?" }
        "gamisation-question-5": { body: "Do you ever feel like you lose yourself in the project?" }
        "learning-question-1": { body: "What would help you to learn more while classifying?" }
        "learning-question-2": { body: "What have you learned about comets since starting this project?" }
        "learning-question-3": { body: "Which other sources of information on comets have you looked at since starting this project?" }
        "learning-question-4": { body: "What knowledge of comets have you shared with others since starting this project?" }
        "learning-question-5": { body: "Is there anything you would like to learn about comets by participating in this project?" }
      }
    }
  }

  contextTypes:
    interventionMonitor: React.PropTypes.object

  getInterventionDetails: (projectSlug, experimentName, interventionID) ->
    details = {}
    debugger
    if projectSlug of @INTERVENTION_DETAILS
      if experimentName of @INTERVENTION_DETAILS[projectSlug]
        if interventionID of @INTERVENTION_DETAILS[projectSlug][experimentName]
          details = @INTERVENTION_DETAILS[projectSlug][experimentName][interventionID]
        if interventionID.includes "statement"
          details["title"]="Interesting Fact:"
        else if interventionID.includes "question"
          details["title"]="A Quick Question:"
    details

  render: ->
    if @context.interventionMonitor?.latestFromSugar
      debugger
      details = {}
      interventionData = @context.interventionMonitor.latestFromSugar
      if "experiment_name" of interventionData and "seq_of_next_event" of interventionData and "current_session_plan" of interventionData
        experiment_name = interventionData["experiment_name"]
        if experiment_name == "CometHuntersVolcroweExperiment1"
          next_event = interventionData["current_session_plan"][interventionData["seq_of_next_event"]]
          if next_event != @CLASSIFICATION_MARKER
            details = @getInterventionDetails @PROJECT_SLUGS.COMET_HUNTERS, experiment_name, next_event
            console.log "got details:",details
    if details
      <div class="intervention">
        <h3>{details.title}</h3>
        <p>{details.body}</p>
      </div>
    else
      <div className="intervention">
        <p>No intervention detected yet.</p>
      </div>

module.exports = Intervention