intervention_config = require './intervention-config'

config = {
  CLASSIFICATION_MARKER: "classification"

  PROJECT_SLUGS_PRODUCTION: {
    COMET_HUNTERS: "mschwamb/hsc-comet-hunters-prototype"
#   when we go live, switch to:
#   COMET_HUNTERS: "mschwamb/comet-hunters"
  }

  PROJECT_SLUGS_STAGING: {
    PLANET_FOUR_TERRAINS: "mschwamb/planet-four-terrains"
  }

  COMET_HUNTERS_VOLCROWE_EXPERIMENT: "CometHuntersVolcroweExperiment1"
}

config.ENABLED_EXPERIMENTS_STAGING = {
  "#{ config.PROJECT_SLUGS_STAGING['PLANET_FOUR_TERRAINS']}": [config.COMET_HUNTERS_VOLCROWE_EXPERIMENT]
}

config.ENABLED_EXPERIMENTS_PRODUCTION = {
  "#{ config.PROJECT_SLUGS_PRODUCTION['COMET_HUNTERS']}": [config.COMET_HUNTERS_VOLCROWE_EXPERIMENT]
}

COMET_HUNTERS_VOLCROWE_EXPERIMENT_INTERVENTIONS = {
  "#{ config.COMET_HUNTERS_VOLCROWE_EXPERIMENT }": {
    "valued-statement-1": {
      title: "Interesting Fact",
      body: "On average, we receive a total of 1900 classifications on this project every day."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "valued-statement-2": {
      title: "Interesting Fact",
      body: "The average contributor to this project has classified a total of 37 images."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "valued-statement-3": {
      title: "Interesting Fact",
      body: "Your input is extremely valuable to the project. Thanks very much, please keep going!"
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "valued-statement-4": {
      title: "Interesting Fact",
      body: "On average, this project receives classifications from 365 individual contributors every week."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "valued-statement-5": {
      title: "A Quick Thought",
      body: "Submitting a few more classifications will make a huge difference to the outcome of this project. Thanks very much, please keep going!"
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "gamisation-statement-1": {
      title: "Interesting Fact",
      body: "Some users as they classify on this project have fun by sharing images of comets that look like other things on Talk such as <a href='https://www.zooniverse.org/projects/mschwamb/comet-hunters/talk/211/37406'>hearts</a> or <a href='https://www.zooniverse.org/projects/mschwamb/comet-hunters/talk/211/48914'>flowers</a>."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "gamisation-statement-2": {
      title: "A Quick Thought",
      body: "Remember, the data you contribute to this project is used to advance scientific knowledge.  Please take your time and make sure you contribute your best possible guess."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "gamisation-statement-3": {
      title: "A Quick Thought",
      body: "We hope you enjoy looking at these images; scientific research should be fun."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "gamisation-statement-4": {
      title: "A Quick Thought",
      body: "If you’re starting to feel bored with this project and would like a break, why not contribute some classifications to <a href='/projects/'>another Zooniverse project</a>?"
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "gamisation-statement-5": {
      title: "A Quick Thought",
      body: "Why not take a break if you feel you need one?"
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "learning-statement-1": {
      title: "Interesting Fact",
      body: "Asteroids are small rocky bodies left over from the construction zones that the planets in our Solar System formed from."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "learning-statement-2": {
      title: "Interesting Fact",
      body: "The asteroids you review on Comet Hunters orbit between Mars and Jupiter roughly at 2-5 times the distance between the Earth and the Sun."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "learning-statement-3": {
      title: "Interesting Fact",
      body: "Buried water ice that has been freshly exposed is thought to be responsible for the cometary-like activity on main-belt comets. It is thought that ancient cousins (in other words, icy asteroids) of today's main-belt comets helped deliver water to the young Earth."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "learning-statement-4": {
      title: "Interesting Fact",
      body: "During an outburst, dust and dirt are ejected off the surface of the asteroid. Sunlight then pushes these small particles into long streaks and complex shapes that we call a main-belt comet's tail."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "learning-statement-5": {
      title: "Interesting Fact",
      body: "Main-belt comets are a new class of minor planets recently discovered in our Solar System. Less than 20 have been discovered to date."
      type: intervention_config.INTERVENTION_TYPES.STATEMENT
    }
    "valued-question-1": {
      title: "A Quick Question",
      body: "How do you know that you are making a valuable contribution to this project?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "valued-question-2": {
      title: "A Quick Question",
      body: "How much money do you think you should receive for each of your classifications if you were being paid to participate in this project?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "valued-question-3": {
      title: "A Quick Question",
      body: "How would you feel if we told you that you've contributed more classifications today than most other users do in a day?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "valued-question-4": {
      title: "A Quick Question",
      body: "How many other users do you think have contributed to this project today?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "valued-question-5": {
      title: "A Quick Question",
      body: "How would you feel if we told you that your classifications are usually more accurate than the average user?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "gamisation-question-1": {
      title: "A Quick Question",
      body: "Does this feel like a game? Explain why or how it does/doesn't feel like one."
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "gamisation-question-2": {
      title: "A Quick Question",
      body: "To what extent do you think you would classify more images if you won things or were thanked or rewarded?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "gamisation-question-3": {
      title: "A Quick Question",
      body: "When you’re classifying, what sort of things put you off or make you bored?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "gamisation-question-4": {
      title: "A Quick Question",
      body: "What do you think about the amount of time it takes to complete one classification?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "gamisation-question-5": {
      title: "A Quick Question",
      body: "Do you ever feel like you lose yourself in the project?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "learning-question-1": {
      title: "A Quick Question",
      body: "What would help you to learn more while classifying?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "learning-question-2": {
      title: "A Quick Question",
      body: "What have you learned about comets since starting this project?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "learning-question-3": {
      title: "A Quick Question",
      body: "Which other sources of information on comets have you looked at since starting this project?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "learning-question-4": {
      title: "A Quick Question",
      body: "What knowledge of comets have you shared with others since starting this project?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
    "learning-question-5": {
      title: "A Quick Question",
      body: "Is there anything you would like to learn about comets by participating in this project?"
      type: intervention_config.INTERVENTION_TYPES.QUESTION
    }
  }
}

config.INTERVENTION_DETAILS_PRODUCTION = {
  "#{ config.PROJECT_SLUGS_PRODUCTION['COMET_HUNTERS']}": COMET_HUNTERS_VOLCROWE_EXPERIMENT_INTERVENTIONS
}

config.INTERVENTION_DETAILS_STAGING = {
  "#{ config.PROJECT_SLUGS_STAGING['PLANET_FOUR_TERRAINS']}": COMET_HUNTERS_VOLCROWE_EXPERIMENT_INTERVENTIONS
}

module.exports = config